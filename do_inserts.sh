DATABASE_URL=postgres://postgres@localhost:5432/texashousewitness npm run migrate up
echo "Saving Sessions"
node relations/00session/2Save/saveSessionsToDB.js 
echo "Saved Sessions"
echo "Saving Reps"
node relations/01representation/2Save/saveRepsToDB.js 
echo "Saved Reps"
echo "Saving Members"
node relations/02member/2Save/insertMembersToDB.js
echo "Saving Committees"
node relations/03committee/2Save/insertCommitteesToDB.js
echo "Saved Committees"