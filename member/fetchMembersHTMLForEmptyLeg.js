/*
 * This script finds either an empty leg, or else the most current leg and scrapes all its members
 * by making a post request to legislative reference library (https://lrl.texas.gov/legeLeaders/members/lrlhome.cfm) 
 * for that legislature and inerts members into member table if necessary.
 */

const fs = require('fs');
const path = require('path');

const fetch = require('node-fetch');

const {getLegWithNoMembers, insertMemberHTMLFile} = require('./db');

(async () => {
	const emptyLeg = await getLegWithNoMembers();
	
	if (!fs.existsSync(path.join('HTML', `${emptyLeg}.html`)))
	{
		//The "form" data, only searching by leg
		let form = {
			"last": "",
			"first": "",
			"gender": "",
			"leg": emptyLeg,
			"chamber": "",
			"district": "",
			"party": "",
			"leaderNote": "",
			"committee": "",
			"roleDesc": "",
			"countyID": "",
			"city": "",
			"RcountyID": ""
		}

		fetch('https://lrl.texas.gov/legeLeaders/members/membersearch.cfm', {
			method: 'POST',
			headers: {
			//headers copied from browser "raw" data. Below vim macro used to turn it into js-compatible header object
			//^i't:a'wi'g_a',j
				'Host': 'lrl.texas.gov',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:85.0) Gecko/20100101 Firefox/85.0',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.5',
				'Accept-Encoding': 'gzip, deflate, br',
				'Referer': 'https://lrl.texas.gov/legeLeaders/members/lrlhome.cfm',
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': '113',
				'Origin': 'https://lrl.texas.gov',
				'Connection': 'keep-alive',
				'Cookie': 'CFID=40198225; CFTOKEN=85756896; JSESSIONID=DD7183B6D5148B33B15E5F5561A8F3EF.cfusion',
				'Upgrade-Insecure-Requests': '1',
				'Cache-Control': 'max-age=0'
			},
			body: new URLSearchParams(form)
		}).then(res => res.text()).then(html => {
			try {
				const filename = emptyLeg + '.html';
				fs.writeFileSync(filename, html);
				insertMemberHTMLFile(emptyLeg, filename);
			} catch (err) {

			}
		}).catch(err => console.error(err));
	}
})();
