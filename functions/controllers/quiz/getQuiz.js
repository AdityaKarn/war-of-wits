const admin = require('firebase-admin');
const db = admin.firestore();

module.exports = async (req,res) => {
    // Firestore
    quiz_id = req.params.id
    quiz = null
    questions = null
    author = null
    await db.collection('quiz').doc(`/${quiz_id}/`).get()
    .then(doc => {
        if (!doc.exists) {
            console.log('No such quiz');
            return res.redirect('/')
        }
        else {
            console.log('Quiz found');
            // console.log('Document data:', doc.data().end_time);
            quiz = doc.data()
        }
    })
    .catch(err => {
        console.log('Error getting document', err);
    });
    currDate = new Date()
    if(currDate.getTime() < quiz.start_time.toDate().getTime() || currDate.getTime() > quiz.end_time.toDate().getTime()) {
        // Quiz has not started yet or has already ended
        // return res.redirect('/')
    }

    await db.collection('question').where('quiz', '==', quiz_id).orderBy('idx').get()
    .then(snapshot => {
        if (snapshot.empty) {
            console.log('No matching questions.');
        }
        questions = new Array()
        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            curr = doc.data()
            curr['id'] = doc.id
            questions.push(curr)
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });

    console.log("Done getting data")

    // console.log(quiz)
    // console.log(questions)
    // console.log(author)
    res.render('quiz', {
        quiz,
        questions,
        quiz_id
    })
};

