module.exports = `
<html lang="en">
<head>
  <title>Authentication successful</title>
  <style>
    body {
      padding: 4em;
    }

    #content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      font-size: 2.5em;
      font-family: sans-serif;
    }
  </style>
</head>
<body>
<script type="text/javascript">
  (() => {
    setTimeout(() => window.close(), 2500); 
  })();
</script>
<div id="content">
  <h3>Authentication successful, the window will close shortly</h3>
</div>
</body>
</html>
`;