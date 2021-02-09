# texashousewitness

## Members
- getMembersHTML.js
Makes a post request to the Texas Legislative reference library website, one request per session.
Writes out individual html files per session.
- allMemsToCSV.js
Parses the html files downloaded above just to get the member names and memberIds. Outputs to csv.
Manual action required - split full names into first name, last name, nick name fields.
- allRepsToCSV.js
Parses the html files downloaded above to representation information - chamber, district, party, county, city

## Committees
- getComitteesByLegislatureHTML.js
Makes POST requests to Texas Legislature Online to get individual HTML pages that list Comittees by
chamber and legislature
