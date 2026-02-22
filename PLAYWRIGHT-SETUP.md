# Playwright browsers – install once, use every time

Cursor (and the sandbox) can clear temporary folders, so Playwright’s default browser cache is often removed when you reopen Cursor. That’s why you have to reinstall Chromium/Firefox every time.

**Fix: use a persistent browser folder**

1. **Set a permanent environment variable (once)**  
   - Press `Win + R`, type `sysdm.cpl`, Enter.  
   - **Advanced** tab → **Environment Variables**.  
   - Under **User variables**, click **New**.  
   - **Variable name:** `PLAYWRIGHT_BROWSERS_PATH`  
   - **Variable value:** `%USERPROFILE%\.playwright-browsers`  
   - OK out of all dialogs.  
   - **Important:** Close and reopen Cursor (or any terminal) so the new variable is picked up.

2. **Install Chromium and Firefox once**  
   In a terminal (PowerShell or CMD, **after** setting the variable above):

   ```bash
   npm run install:browsers
   ```

   Chromium and Firefox will be installed in `C:\Users\<YourName>\.playwright-browsers` and will stay there across Cursor restarts.

3. **Run tests**  
   Use your usual commands; Playwright will use the same folder:

   ```bash
   npm run test:e2e:headed
   ```

You only need to run `npm run install:browsers` again after upgrading the `@playwright/test` package.
