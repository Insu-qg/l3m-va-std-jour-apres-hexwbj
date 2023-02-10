// Import stylesheets
import { jourAprès } from './jourApres';
import './style.css';
import './utils';
import { Assertion, LogTests } from './utils';

/***********************************************************************************************************************
 * A FAIRE : Complétez avec votre mail UGA
 */
const mailIdentification = 'quentin.grange@etu.univ-grenoble-alpes.fr';

/***********************************************************************************************************************
 * A FAIRE : Liste de tests à effectuer
 * Chaque test est exprimé par un objet contenant 3 attributs
 *   - args : le tableau des arguments à passer à la fonction f
 *   - expectedResult : le résultat attendu
 *   - comment : un commentaire sous forme de chaine de caractère
 */
const tests: Assertion<
  Parameters<typeof jourAprès>,
  ReturnType<typeof jourAprès>
>[] = [
  // -------------- cas simple (generale) --------------------
  {
    // cas general
    args: [[4, 2, 1]],
    expectedResult: [5, 2, 1],
    comment: 'date valide',
  },

  // --------------- cas format non respecté -----------------
  {
    // cas nb à virgule (jour)
    args: [[1.4, 12, 4]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être entiers.',
  },
  {
    // cas nb à virgule (mois)
    args: [[1, 1.5, 4]],
    expectedError: 'date invalide',
    comment: 'les mois doivent être entiers.',
  },
  {
    // cas nb à virgule (annees)
    args: [[1, 12, 4.6]],
    expectedError: 'date invalide',
    comment: 'les annees doivent être entiers.',
  },
  {
    // cas négatif (jour)
    args: [[-1, 12, 4]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être positifs.',
  },
  {
    // cas negatif (mois)
    args: [[1, -12, 4]],
    expectedError: 'date invalide',
    comment: 'les mois doivent être positifs.',
  },
  {
    // cas 0 (mois)
    args: [[1, 0, 4]],
    expectedError: 'date invalide',
    comment: 'les mois doivent être >0.',
  },
  {
    // cas 0 (jours)
    args: [[0, 12, 4]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être >0.',
  },

  // les annees peuvent etre négatives / = 0
  //-------------------------- cas ou le nb de jours/mois dépasse sa valeur max -------
  {
    // cas nb jour trop élevé pour un mois de 31 jours
    args: [[32, 1, 4]],
    expectedError: 'date invalide',
    comment:
      'les jours doivent être <= à 30 ou 31 en fonction du mois(+exception fevrier 28 ou 29 en bsx).',
  },
  {
    // cas nb jour trop élevé pour un mois de 30 jours
    args: [[31, 4, 4]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être <= 30 pour avril .',
  },
  {
    // cas nb jour trop élevé pour fevrier non bsx
    args: [[29, 2, 1]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être <= 28 pour avril .',
  },
  {
    // cas nb jour trop élevé pour fevrier bsx
    args: [[30, 2, 2024]],
    expectedError: 'date invalide',
    comment: 'les jours doivent être <= 29 pour avril .',
  },
  {
    // cas nb mois trop élevé
    args: [[1, 13, 1]],
    expectedError: 'date invalide',
    comment: 'les mois doivent être <= 12 .',
  },

  //------------------------- jours suivant (sans pb) -----------------

  {
    // cas jours suivant d'un mois de 31 jours (hors 12)
    args: [[31, 1, 4]],
    expectedResult: [1, 2, 4],
    comment: '',
  },
  {
    // cas jours suivant pour mois = 12 et jours = 31
    args: [[31, 12, 4]],
    expectedResult: [1, 1, 5],
    comment: '',
  },
  {
    // cas jours suivant pour mois de 30 jours
    args: [[30, 4, 4]],
    expectedResult: [1, 5, 4],
    comment: '',
  },
  {
    // cas jours suivant pour mois de fevrier bsx
    args: [[29, 2, 2024]],
    expectedResult: [1, 3, 2024],
    comment: '',
  },
  {
    // cas jours suivant pour mois de fevrier non bsx
    args: [[28, 2, 2023]],
    expectedResult: [1, 3, 2023],
    comment: '',
  },
];

/***********************************************************************************************************************
 * NE PAS TOUCHER !!!
 */
LogTests<typeof jourAprès>(
  "Fonction qui renvoie le jour d'après",
  jourAprès,
  'jourAprès',
  tests,
  document.querySelector('#local')!
);

const url =
  'https://script.google.com/macros/s/AKfycbzRVLyEXqvi6KTXDQKOwwNOqISerOTZy6ce8gaIAAVg777fxLvliAheE3QjokRsdfQ9/exec';

const bt = document.querySelector('button')!;
const section = document.querySelector('#results')!;

bt.onclick = async () => {
  bt.disabled = true;
  const fstr = jourAprès.toString();
  const bodyStr = fstr.slice(fstr.indexOf('{') + 1, fstr.lastIndexOf('}'));
  const paramsString = fstr.slice(0, fstr.indexOf('{') - 1);

  const form = new FormData();
  form.append('id', mailIdentification);
  form.append('f', bodyStr);
  form.append('params', paramsString);
  form.append('tests', JSON.stringify(tests));

  console.log('POST...');
  const R = await fetch(url, {
    method: 'POST',
    body: form,
  });
  console.log('...received response ...');
  const res: { error: string } | { testPassed: boolean[] } = await R.json();
  console.log('... response decoded.');
  let t = 0;
  const resErr = res as { error: string };
  if (resErr.error) {
    section.innerHTML = `<pre>${resErr.error}</pre>`;
    const [, strT] = /([0-9]*) secondes$/.exec(resErr.error)!;
    t = +strT;
    console.log(strT, t);
    const inter = setInterval(() => {
      t--;
      if (t <= 0) {
        bt.disabled = false;
        section.textContent = '';
        clearInterval(inter);
      } else {
        section.innerHTML = `<pre>Vous ne pouvez pas resoumettre avant ${t} secondes
  </pre>`;
      }
    }, 1000);
  } else {
    const resOK = res as {
      testPassed: boolean[];
      testsVsCoderef: boolean[];
      discardedMutants: boolean[];
    };
    console.log('no errors...');
    section.innerHTML = `
      Tests de référence passés par votre code (vert = le test passe):<br/>
      <table class="result"><tbody><tr>
      ${resOK.testPassed
        .map((t, i) => `<td class="${t ? '' : 'in'}correct">${i}</td>`)
        .join('')}
      </tr></tbody></table>
      <br/><br/>
      Vos tests passés sur le code de référence :<br/>
      <table class="result"><tbody><tr>
      ${resOK.testsVsCoderef
        .map((t, i) => `<td class="${t ? '' : 'in'}correct">${i}</td>`)
        .join('')}
      </tr></tbody></table>
      <br/><br/>
      Mutants éliminés par vos tests (vert = le mutant est éliminé) :<br/>
      <table class="result"><tbody><tr>
      ${resOK.discardedMutants
        .map((t, i) => `<td class="${t ? '' : 'in'}correct">${i}</td>`)
        .join('')}
      </tr></tbody></table>
    `;
  }
};
