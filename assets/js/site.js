// Register service worker, if browser supports them
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
  .then(function(registration) {
    console.log('Registered service worker scoped to', registration.scope);
  })
  .catch(function(error) {
    console.error('Failed to register service worker', error)
  });
}

if (typeof fetch !== 'undefined' && typeof document.querySelector !== 'undefined') {

  // Used in the formatted fetch results from GitHub
  var namedMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  // Fetch latest commit from GitHub
  var github_url = (function() {
    var url = document.querySelector('#footer a[href^="https://github"]').getAttribute('href'); // grab the href value of the repo link
    if (typeof(url) !== 'undefined') {
      var fragment = url.substring(url.indexOf('.com/') + 5); // find the tail end (5 = .com/)
      return 'https://api.github.com/repos/' + fragment + '/commits?per_page=1'; // return the API url
    }
  })();

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if(typeof(github_url) !== "undefined") {
    fetch(github_url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var commit = {};
      data = data[0]; // only need most recent commit
      // Lowercase commit message's first word to run in `...to XYZ` copy:
      commit.message = data.commit.message.charAt(0).toLowerCase() + data.commit.message.slice(1);
      commit.url = data.html_url;
      commit.stamp = data.commit.author.date;
      commit.date = new Date(commit.stamp);
      // Put the date in Day, Month 31 at <Local Time String> format
      commit.time_string =
        namedMonths[commit.date.getMonth()] + ' ' +
        commit.date.getDate() + ', ' +
        commit.date.getFullYear() + ', ';
      // Append to footer on calendar
      document.querySelector('#colophon p').innerHTML +=
        ' Site last updated on <time datetime="' + commit.stamp + '">' + commit.time_string +
        '</time> to <a id="commit-message" href="' + commit.url + '">' + escapeHTML(commit.message) + '</a>.';
    });
  }
}
