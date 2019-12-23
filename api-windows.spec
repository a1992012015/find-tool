# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['tool\\api.py'],
             pathex=['D:\\project-test\\find-tool'],
             binaries=[],
             datas=[('C:\\Users\\Garnet\\AppData\\Local\\Programs\\Python\\Python38-32\\lib\\site-packages\\z3\\', 'z3')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          [],
          exclude_binaries=True,
          name='api',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True )
coll = COLLECT(exe,
               a.binaries,
               a.zipfiles,
               a.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='api')
