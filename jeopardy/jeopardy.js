// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

const categories = [];
let offset = 0;

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
    const categoryIds = [];
    const getCats = await axios.get('https://jservice.io/api/categories', {params: {count: 100, offset}});
    const randomCats = await _.sampleSize(getCats.data, 6);
    offset += 100;
    for (let i = 0; i < 6; i++){
        if (randomCats[i].clues_count < 5){
            const getnewCats = await axios.get('https://jservice.io/api/categories', {params: {count: 100, offset}});
            const newRandomCat = await _.sampleSize(getnewCats.data, 1);
            let newCatId = newRandomCat[0].id
            categoryIds.push(newCatId);
        } else {
            categoryIds.push(randomCats[i].id);
        }
    }
    categoryIds.forEach( cat => {
        getCategory(cat);
    });
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(catId) {
    categories.length = 0; //I got this solution form https://www.javascripttutorial.net/array/4-ways-empty-javascript-array/
    const category = {};
    const clueArr = [];
    const getCat = await axios.get('https://jservice.io/api/category', {params: {id: catId}});
    const questions = await _.sampleSize(getCat.data.clues, 5);
    for (let i = 0; i < 5; i++){
        const clue = {};
        clue["question"] = questions[i].question;
        clue["answer"] = questions[i].answer;
        clue["showing"] = null;
        clueArr.push(clue);
    }
    category["title"] = await getCat.data.title;
    category["clues"] = clueArr;
    categories.push(category);
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    for (let i = 0; i < 6; i++){
        const $theadTd = $(`#cat-${i+1}`);
        console.log($theadTd);
        console.log(categories[i]);
        $theadTd.text(categories[i].title);
    }
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    fillTable();    
}

/** On click of start / restart button, set up game. */
const btn = document.querySelector('#setup');
btn.addEventListener('click', () => {
    setupAndStart()
});

// Initializes categories so that first click of start button doesn't throw an error
getCategoryIds();
