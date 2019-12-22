# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['tool/api.py'],
             pathex=['/Users/liujie/test-project/find-tool'],
             binaries=[],
             datas=[('/Users/liujie/Library/Python/3.7/lib/python/site-packages/z3/', 'z3')],
             hiddenimports=[],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,y
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
