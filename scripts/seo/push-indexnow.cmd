@echo off
REM push-indexnow.cmd — IndexNow 推送一键脚本（双击即可运行）
REM 说明:
REM   实际推送逻辑在 push-indexnow.ps1，本脚本只是免去手敲
REM   "powershell -ExecutionPolicy Bypass -File" 的长命令。
REM   运行后窗口会停留，方便查看推送结果；按任意键关闭。

chcp 65001 >nul

echo ============================================
echo  IndexNow 推送  nocodecsv.com - Bing
echo ============================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0push-indexnow.ps1"
set "EXIT=%ERRORLEVEL%"

echo.
if "%EXIT%"=="0" (
    echo [一键脚本] 推送完成，退出码 0
) else (
    echo [一键脚本] 推送失败，退出码 %EXIT%  ^(详见上方输出^)
)

echo.
pause
exit /b %EXIT%
