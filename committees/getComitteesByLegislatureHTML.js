/*
 * This script loops through each session from 75 (the first session with reliable data
 * to (86). Makes a post request to Texas Legislatrure online by session & writes 
 * out the html document to 75.html, 76.html etc. by legislature.
 *
 * HTML contains committee names and links to obtain HTML that has all committee meetings
 * for that committee. 
 *
 * Parsing of those docs done elsewhere.
 *
 */

const fetch = require('node-fetch');
const fs = require('fs');

//The "form" data, only searching by leg
let form = {
  "__EVENTTARGET": "ddlLegislature",
  "__EVENTARGUMENT": "",
  "__LASTFOCUS": "",
  "__VIEWSTATE": "/wEPDwUJNzk1OTc1ODk0D2QWBgIBDxYCHglpbm5lcmh0bWwFK1RleGFzIExlZ2lzbGF0dXJlIE9ubGluZSAtIEhvdXNlIENvbW1pdHRlZXNkAgMPZBYIZg8PFgIeCEltYWdlVXJsBRl+L0ltYWdlcy9jYXBpdG9sU21hbGwuanBnFgQeBVdpZHRoBQMxMDgeBkhlaWdodAUCNTBkAgEPDxYCHgRUZXh0BRhUZXhhcyBMZWdpc2xhdHVyZSBPbmxpbmVkZAICDw8WAh8EBRBIb3VzZSBDb21taXR0ZWVzZGQCAw8WAh8EBacCPGZvbnQgc3R5bGU9ImZvbnQtd2VpZ2h0OiBib2xkOyBmb250LXNpemU6IDEwcHgiIGNvbG9yPXdoaXRlPkhvdXNlOiA8c2NyaXB0IHNyYz0iL3Rsb2RvY3MvU2Vzc2lvblRpbWUvSG91c2VTZXNzVGltZS5qcz92PTQ0MjM2Ij48L3NjcmlwdD48L2ZvbnQ+PGJyLz48Zm9udCBzdHlsZT0iZm9udC13ZWlnaHQ6IGJvbGQ7IGZvbnQtc2l6ZTogMTBweCIgY29sb3I9d2hpdGU+U2VuYXRlOiA8c2NyaXB0IHNyYz0iL3Rsb2RvY3MvU2Vzc2lvblRpbWUvU2VuYXRlU2Vzc1RpbWUuanM/dj00NDIzNiI+PC9zY3JpcHQ+PC9mb250PmQCBw9kFgICAQ8QDxYGHg1EYXRhVGV4dEZpZWxkBQtEZXNjcmlwdGlvbh4ORGF0YVZhbHVlRmllbGQFC0xlZ2lzbGF0dXJlHgtfIURhdGFCb3VuZGdkEBUREDg3dGggTGVnaXNsYXR1cmUQODZ0aCBMZWdpc2xhdHVyZRA4NXRoIExlZ2lzbGF0dXJlEDg0dGggTGVnaXNsYXR1cmUQODNyZCBMZWdpc2xhdHVyZRA4Mm5kIExlZ2lzbGF0dXJlEDgxc3QgTGVnaXNsYXR1cmUQODB0aCBMZWdpc2xhdHVyZRA3OXRoIExlZ2lzbGF0dXJlEDc4dGggTGVnaXNsYXR1cmUQNzd0aCBMZWdpc2xhdHVyZRA3NnRoIExlZ2lzbGF0dXJlEDc1dGggTGVnaXNsYXR1cmUQNzR0aCBMZWdpc2xhdHVyZRA3M3JkIExlZ2lzbGF0dXJlEDcybmQgTGVnaXNsYXR1cmUQNzFzdCBMZWdpc2xhdHVyZRURAjg3Ajg2Ajg1Ajg0AjgzAjgyAjgxAjgwAjc5Ajc4Ajc3Ajc2Ajc1Ajc0AjczAjcyAjcxFCsDEWdnZ2dnZ2dnZ2dnZ2dnZ2dnZGRkgEwB6yuK3azsELqh46mDNomHUOs=",
  "__VIEWSTATEGENERATOR": "BE208E06",
  "__EVENTVALIDATION": "/wEdABMdExkfVAWL/CqNgC3SXha9q+HxWR5iRNuO4+APx5arhZOktqOZo04Mg0QvQd3uFOEHGw+w4LbTdHgsbQMre9WeK24EkOTO9D4hQ4XaWIq277nAHBF5OzyEvo7ZGawn0/D74uA222t2/xm7bYvJB3AfXuG8nnq4xfUuk7rspTqwlJYJb4tS8v8HrukKsSGTZE3Et+wUcfJosFNmKODTr96FuO77GbDIYbMnX1ISlGykxJj3bsdh1LMVGNilz1YrQptny+/L3bAEwCK8xHizLVOrZVoqthb1ZVcci8KCz28GVR6PvR+JSYB9k3J3dho5XrihUg21ppOajonQzOFiVJzCIXDjpBBDBpmXuhzRLzrFeL9xPrtmL0Ux2Vi+Vgt9+i4J6vBaHSegFNjcLqj4IqQMzn2L27qbRgWcX2zEL79NYsTBR8c=",
  "ddlLegislature": ""
}

const chambers = ['H', 'S', 'J'];

(async () => {
  for (let i = 75; i <= 86; i++) {
    for (let chamber of chambers) {
      form.ddlLegislature = i.toString();
      try {
        const res = await fetch('https://capitol.texas.gov/Committees/Committees.aspx?Chamber=' + chamber, {
          method: 'POST',
          headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:85.0) Gecko/20100101 Firefox/85.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': '1966',
            'Origin': 'https://capitol.texas.gov',
            'Connection': 'keep-alive',
            'Referer': 'https://capitol.texas.gov/Committees/Committees.aspx?Chamber=J',
            'Cookie': 'ASP.NET_SessionId=5sa3v2bk4yk44xzcb5orzq1b; StickyPrefs=LegSess=86R&InfoType=&SearchType=',
            'Upgrade-Insecure-Requests': '1',
          },
          body: new URLSearchParams(form)
        });
        const html = await res.text();
        fs.writeFileSync(chamber + '_' + i + '.html', html);
        await new Promise(resolve => {
          setTimeout(resolve, 10000)
        })
      } catch (err) {
        console.error(err)
      }
    }
  }
})();
//^i't:a'wi'g_a',j
