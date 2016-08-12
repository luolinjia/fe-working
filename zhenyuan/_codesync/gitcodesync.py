#coding=utf-8
import os, sys, subprocess
import ConfigParser, argparse #argparse 2.7才有
import ssh #easy_install ssh
import locale

class CodeSyncConfig(ConfigParser.ConfigParser):
    """
    需要基础配置
    default
    local_code=
    sub_dir= 仓库下的某个目录，有时候一个仓库下有好几个项目的代码
    """

    def __init__(self):
        ConfigParser.ConfigParser.__init__(self)
        self.cmd_line_parser = argparse.ArgumentParser(description="Need config file path")
        self.cmd_line_parser.add_argument('-c', type=str, help='config file path(windows ini format)',
                nargs=1, default='codesync.conf')
        self.cmd_line_parser.add_argument('-s', type=str, help='shell file path(one line one shell command)',
                nargs=1, default='remoteshell.sh')
        self.cmd_line_parser.add_argument('-a', action='store_true', default=False)
        args = self.cmd_line_parser.parse_args()
        self.uploadall = args.a

        config_file_path = args.c
        if isinstance(args.c, list):
            config_file_path = args.c[0]
        else:
            #默认地址要加上路径
            app_path = os.path.dirname(os.path.abspath(__file__))
            config_file_path = app_path + os.sep + config_file_path
        if not os.path.isfile(config_file_path):
            self.cmd_line_parser.print_help()
            sys.exit()

        self.config_file_path = config_file_path

        try:
            self.parseConfig(config_file_path)
        except Exception,e:
            print e
            self.cmd_line_parser.print_help()
            sys.exit()


        #shell命令文件地址
        shell_file_path = args.s
        if isinstance(args.s, list):
            shell_file_path = args.s[0]
            if not os.path.isfile(shell_file_path):
                self.cmd_line_parser.print_help()
                sys.exit()
        else:
            #默认地址要加上路径
            app_path = os.path.dirname(os.path.abspath(__file__))
            shell_file_path = app_path + os.sep + shell_file_path

        if os.path.isfile(shell_file_path):
            self.shell_file_path = shell_file_path
        else:
            self.shell_file_path = None

    def parseConfig(self, config_file_path):
        if not os.path.isfile(config_file_path):
            return
        self.read([config_file_path])

    @staticmethod
    def instance():
        if not hasattr(CodeSyncConfig, "_instance"):
            CodeSyncConfig._instance = CodeSyncConfig()
        return CodeSyncConfig._instance

class FileChecker(object):
    """文件检查基类"""
    def __init__(self, base_dir, sub_dir = None):
        self.base_dir = None
        if os.path.isdir(base_dir):
            self.base_dir = base_dir

        self.sub_dir = sub_dir

    def addeds(self):
        pass

    def dels(self):
        pass

    def modifieds(self):
        pass

    def rescan(self):
        """
        重新检查文件情况
        """
        pass

class FileUploader(object):
    """
    文件上传基类
    update操作如果遇到文件夹，只创建文件夹，但并不上传包含文件
    返回的文件地址必须是本地绝对地址
    """
    def __init__(self):
        pass

    def dels(self, files):
        pass

    def update(self, files):
        pass

    def close(self):
        """关闭链接"""
        pass

class GitFileChecker(FileChecker):

    """
    git_cmd= git命令地址,默认直接为git
    """
    config_section_name = 'gitfilechecker'

    def __init__(self, base_dir = None, sub_dir = None):
        super(GitFileChecker, self).__init__(base_dir, sub_dir)
        self.config = CodeSyncConfig.instance()
        if self.config.has_option(self.config_section_name, 'git_cmd'):
            self.git_cmd = self.config.get(self.config_section_name, 'git_cmd')
        else:
            self.git_cmd = 'git'

    def addeds(self):
        changes = self.__changes()
        return changes['addeds']

    def dels(self):
        changes = self.__changes()
        return changes['dels']

    def modifieds(self):
        changes = self.__changes()
        return changes['modifieds']

    def rescan(self):
        self._changes_cache = None

    def __exec_git(self):
        args = ['%s' % self.git_cmd, 'status', '--porcelain']
        if self.sub_dir:
            args.append(self.sub_dir)
        try:
            p = subprocess.Popen(args, cwd = self.base_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            return p.stdout.readlines()
        except Exception,e:
            return []

    def __exec_files(self):
        args = ['%s' % self.git_cmd, 'ls-files']
        if self.sub_dir:
            args.append(self.sub_dir)
        lines = []
        try:
            p = subprocess.Popen(args, cwd = self.base_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            lines = p.stdout.readlines()
        except Exception,e:
            return lines 
        lines = ["M %s" % l for l in lines if l[0]!='"' and  (len(l)<5 or l[:5]!='fonts')] #兼容标准的判断方式
        return lines

    def __changes(self):
        if hasattr(self, '_changes_cache') and not (self._changes_cache is None):
            return self._changes_cache

        addeds = []
        dels = []
        modifieds = []
        lines = []
        if self.config.uploadall:
            lines = self.__exec_files()
        else:
            lines = self.__exec_git()

        for line in lines:
            line = line.strip()
            s, path = line.split(' ', 1)
            s = s.strip()
            path = path.strip().rstrip('/')
            local_file_path = self.base_dir + os.sep + path
            if s in ('??', 'M', 'MM'):
                modifieds.append(local_file_path)

            if s == 'A':
                addeds.append(local_file_path)
            if s == 'R':
                del_path, m_path = path.split('->')
                local_del_path = self.base_dir + os.sep + del_path.strip()
                local_m_path = self.base_dir + os.sep + m_path.strip()
                dels.append(local_del_path)
                modifieds.append(local_m_path)
            if s == 'D':
                dels.append(local_file_path)

        self._changes_cache = {}
        self._changes_cache['addeds'] = addeds
        self._changes_cache['dels'] = dels
        self._changes_cache['modifieds'] = modifieds
        return self._changes_cache


class SFtpFileUploader(FileUploader):
    """
    sftp文件操作
    需要sftpfileuploader的配置
    [sftpfileuploader]
    username=
    password=
    remote_path=
    host=
    port=
    """
    config_section_name = 'sftpfileuploader'
    def __init__(self, base_path, sub_dir = None):
        self.base_path = base_path
        if sub_dir:
            self.base_path = self.base_path + os.sep + sub_dir
        self.config = CodeSyncConfig.instance()
        self.username = self.config.get(self.config_section_name, 'username')
        self.password = self.config.get(self.config_section_name, 'password')
        self.remote_path = self.config.get(self.config_section_name, 'remote_path')
        last_char = self.remote_path[-1]
        if last_char == '/' or last_char == '\\':
            self.remote_path = self.remote_path[:-1]

        self.host = self.config.get(self.config_section_name, 'host')
        self.port = 22
        if self.config.has_option(self.config_section_name, 'port'):
            self.port = self.config.getint(self.config_section_name, 'port')


        t = ssh.Transport((self.host, self.port))
        t.connect(username=self.username, password=self.password)
        self.sftp = ssh.SFTPClient.from_transport(t)
        self.t = t

    def update(self, files):
        self._updated_dirs = {}
        if len(files) <= 0:
            return

        for local_file_path in files:
            if os.path.isdir(local_file_path) :
                if  not self._updated_dirs.has_key(local_file_path):
                    self._updated_dirs[local_file_path] = True
                    self.__updateDir(local_file_path)
            else:
                self.__updateFile(local_file_path)

        return True

    def __updateDir(self, local_dir):
        for root, dirs, files in os.walk(local_dir):
            #如果是空文件夹也尝试去创建一下
            base_file_path = root.replace(self.base_path, '')
            remote_dir = self.remote_path + base_file_path
            try:
                self.__chdir(remote_dir)
            except IOError:
                self.__mkdir(remote_dir)
                self.__chdir(remote_dir)
                print "upload:%s success!" % root
            for file_path in files:
                local_file_path = root + os.sep + file_path
                self.__updateFile(local_file_path)



    def __updateFile(self, local_file_path):
            base_file_path = local_file_path.replace(self.base_path, '')
            remote_path = self.remote_path + base_file_path
            remote_dir, basename = os.path.split(remote_path)
            try:
                self.__chdir(remote_dir)
            except IOError:
                self.__mkdir(remote_dir)
                self.__chdir(remote_dir)

            self.sftp.put(local_file_path, basename)
            try:
                self.sftp.chmod(basename, 0664)
            except IOError:
                #不是自己的文件改不了权限
                pass

            print "upload:%s success!" % local_file_path

    def __chdir(self, remote_dir):
        remote_dir = remote_dir.replace('\\', '/')
        self.sftp.chdir(remote_dir)

    def __mkdir(self, remote_dir):
        remote_dir = remote_dir.rstrip('/')
        sub_remote_dir, basename = os.path.split(remote_dir)
        try:
            self.__chdir(sub_remote_dir)
        except IOError:
            self.__mkdir(sub_remote_dir)
            self.__chdir(sub_remote_dir);
        self.sftp.mkdir(basename)
        try:
            self.sftp.chmod(basename, 0775)
        except:
            pass

    def close(self):
        if hasattr(self, 't'):
            self.t.close()
        if hasattr(self, 'sftp'):
            self.sftp.close()

    def __del__(self):
        if hasattr(self, 't'):
            self.t.close()

class ShellRunner(object):

    #与sftpfileuploader共用链接配置
    config_section_name = 'sftpfileuploader'

    def __init__(self):
        pass

    def run(self):
        self.config = CodeSyncConfig.instance()
        shell_file_path = self.config.shell_file_path
        if not shell_file_path:
            return

        self.username = self.config.get(self.config_section_name, 'username')
        self.password = self.config.get(self.config_section_name, 'password')

        self.host = self.config.get(self.config_section_name, 'host')
        self.port = 22
        if self.config.has_option(self.config_section_name, 'port'):
            self.port = self.config.getint(self.config_section_name, 'port')

        client = ssh.SSHClient()
        client.load_system_host_keys()
        client.set_missing_host_key_policy(ssh.AutoAddPolicy())
        client.connect(self.host, self.port, self.username, self.password)
        try:
            fh = open(shell_file_path, 'r')
            commands = fh.readlines()
        except Exception,e:
            print e
            client.close()
            return

        for c in commands:
            ch = client.get_transport().open_session()
            ch.exec_command(c)
            exit_code = ch.recv_exit_status()
            print ch.recv(9999)
            print ch.recv_stderr(9999)
            #if exit_code != 0:
                #print '\033[91mBuild Failed!\033[0m'
                #print ch.recv(9999)
            ch.close()
        client.close()

class CodeSync(object):
    def __init__(self):
        self.config = CodeSyncConfig.instance()

    def run(self):
        """执行比较操作"""
        if not self.config.has_option('default', 'local_code'):
            print '配置文件default段需要local_code指定本地代码路径'
            return

        sub_dir = None
        if self.config.has_option('default', 'sub_dir'):
            sub_dir = self.config.get('default', 'sub_dir')
        else:
            sub_dir = None

        self.local_code_path = self.config.get('default', 'local_code')
        last_char = self.local_code_path[-1]
        if last_char == '/' or last_char == '\\':
            self.local_code_path = self.local_code_path[:-1]

        self.filechecker = GitFileChecker(self.local_code_path, sub_dir)

        addfiles = self.filechecker.addeds()
        modifieds = self.filechecker.modifieds()
        dels = self.filechecker.dels()
        if len(addfiles) + len(modifieds) + len(dels) <= 0:
            return

        self.fileuploader = SFtpFileUploader(self.local_code_path, sub_dir)
        self.fileuploader.update(addfiles)
        self.fileuploader.update(modifieds)
        
        #关闭链接
        self.fileuploader.close()

        #远程代码执行
        #shell_runner = ShellRunner()
        #shell_runner.run()

def initLocale():
    # init the locale
    if sys.platform == 'win32':
        locale.setlocale( locale.LC_ALL, '' )

    else:
        if 'LC_ALL' in os.environ:
            try:
                locale.setlocale( locale.LC_ALL, os.environ['LC_ALL'] )
                return
            except locale.Error:
                pass

        language_code, encoding = locale.getdefaultlocale()
        if language_code is None:
            language_code = 'en_US'

        if encoding is None:
            encoding = 'UTF-8'
        if encoding.lower() == 'utf':
            encoding = 'UTF-8'

        try:
            # setlocale fails when params it does not understand are passed
            locale.setlocale( locale.LC_ALL, '%s.%s' % (language_code, encoding) )
        except locale.Error:
            try:
                # force a locale that will work
                locale.setlocale( locale.LC_ALL, 'en_US.UTF-8' )
            except locale.Error:
                locale.setlocale( locale.LC_ALL, 'C' )
if __name__ == '__main__':
    initLocale()
    cs = CodeSync()
    cs.run()

