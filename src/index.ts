import { of, range, fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, take, tap, retry, switchMap } from 'rxjs/operators';

const divWrapper = document.createElement('div');
document.body.appendChild(divWrapper);

const paramString = document.querySelector('input').value;
const btnGitHub = document.querySelector('.github');
const btnGitLab = document.querySelector('.gitlab');
const urlHub = `https://api.github.com/search/repositories?q=${paramString}`;
const urlLab = `https://gitlab.com/api/v4/projects?search=${paramString}`;
const githubClick = fromEvent(btnGitHub,'click');
const gitlabClick = fromEvent(btnGitLab,'click');

// =========================
gitlabClick.pipe( 
  retry(3),
  switchMap(() => ajax.getJSON(urlLab)),
)
.subscribe({
  next: (value: any[]) => {
    console.log('EVent', value);
    fnList(value);
  },
  error: (error) => console.log('error', error),
});

// =========================
githubClick.pipe( 
    retry(3),
    switchMap(() => ajax.getJSON(urlHub)),
  )
  .subscribe({
    next: (value: {items: any[]}) => {
      // console.log('EVent', value);
      fnList(value.items);
    },
    error: (error) => console.log('error', error),
  });
  

  // ========================
  function fnList(items: any[])  {
  const repsName = items.map((item: {name: string}) => item.name);
  divWrapper.innerHTML='';
  repsName.forEach((name) => {
    divWrapper.insertAdjacentHTML('beforeend', `<p>${name}</p>`);
  })
}
