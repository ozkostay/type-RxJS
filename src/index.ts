import { of, range } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, take, tap, retry, switchMap } from 'rxjs/operators';

const divWrapper = document.createElement('div');
document.body.appendChild(divWrapper);

const param = 'type-rxjs';
const url = `https://api.github.com/search/repositories?q=${param}`;
console.log(url);
of(url)
  .pipe( 
    // map(x => x + 2),
    retry(3),
    tap((o) => console.log('xxx', o)),
    switchMap((o) => ajax.getJSON(o)),
  )
  .subscribe({
    next: (value) => {
      console.log('EVent', value);
      fnList(value);
    },
    error: (error) => console.log('error', error),
  });
  
  function fnList(obj: any) {
    // console.log('OBJ', obj);
    // for (let key in obj) {
    //   console.log(key);
    // }
    const reps: any[] = obj.items;
    const repsName = reps.map((item) => item.name);
    divWrapper.innerHTML='';
    reps.forEach((item) => {
      //console.log(item.name);
      divWrapper.insertAdjacentHTML('beforeend', `<p>${item.name}</p>`);
    })
  }