const todoInput = document.querySelector(".todo_input");
const todoList = document.querySelector(".todo_list");
const comlpeteAllBtnElm = document.querySelector(".comlpeteAll_btn");
const leftItemsElem = document.querySelector('.left_items');

const showAllBtnElem = document.querySelector(".show-all-btn");
const showActiveBtnElem = document.querySelector(".show-active-btn");
const showCompleteBtnElem = document.querySelector(".show-completed-btn");
const clearCompleteBtnElem = document.querySelector(".clear-comlpete-btn");

let id = 0; //각각의 할 일들을 구별할 수 있는 키 값을 설정하기 위해 선언
const setId = (newId) => {id = newId};

let isAllCompleted = false; // 전체 todos 체크 여부
const setIsAllCompleted = (bool) => { isAllCompleted = bool };

let currentShowType = 'all'; //all & active & complete
const setCurrentShowType = (newShowType) => currentShowType = newShowType;

let todos = []; //할 일들을 담을 배열
const setTodos = (newTodos)=>{
  todos = newTodos;
}

const getAllTodos = ()=>{
  return todos;
}

const getCompletedTodos = ()=>{
  return todos.filter(todo => todo.isCompleted === true);
}

//현재 완료되지 않은 할 일 리스트를 반환
const getActiveTodos = ()=>{
  return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = ()=>{
  const leftTodos = getActiveTodos();
  leftItemsElem.innerHTML = `남은 할 일 : ${leftTodos.length}`;
}

const completeAll = ()=>{
  comlpeteAllBtnElm.classList.add('checked');
  const newTodos = getAllTodos().map( todo => ({...todo, isCompleted: true}) );
  setTodos(newTodos);
}

const incompleteAll = ()=>{
  comlpeteAllBtnElm.classList.remove('checked');
  const newTodos = getAllTodos().map( todo => ({...todo, isCompleted: false}) );
  setTodos(newTodos);
}

//전체 todos의 check 여부(isCompleted)
const checkIsAllCompleted = () => {
  if(getAllTodos().length === getCompletedTodos().length){
    setIsAllCompleted(true);
    comlpeteAllBtnElm.classList.add('checked');
  } else {
    setIsAllCompleted(false);
    comlpeteAllBtnElm.classList.remove('checked');
  }
}

const onClickCompleteAll = ()=>{
  if(!getAllTodos().length) return; //todo배열의 길이가 0이면 return

  if(isAllCompleted) incompleteAll(); //isAllCompleted가 true이면 todos를 전체 미완료 처리
  else completeAll(); //isAllCompleted가 false이면 todos를 전체 완료 처리
  setIsAllCompleted(!isAllCompleted); //isAllCompleted 토글
  paintTodos(); //새로운 todos를 렌더링
  setLeftItems(); //남은 할 일 개수 표시
}

const appendTodos = (text)=>{
  const newId = id++;
  const newTodos = getAllTodos().concat({ id: newId,  isCompleted: false,  content: text })
  setTodos(newTodos);
  checkIsAllCompleted(); //전체 완료처리 확인
  setLeftItems(); //남은 할 일 개수 표시
  paintTodos();
}

const deletTodo = (todoId)=>{
  const newTodos = getAllTodos().filter(todo => todo.id !== todoId);
  setTodos(newTodos);
  setLeftItems(); //남은 할 일 개수 표시
  paintTodos();
}

const completeTodo = (todoId) => {
  const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo, isCompleted: !todo.isCompleted} : todo)
  setTodos(newTodos);
  paintTodos();
  setLeftItems(); //남은 할 일 개수 표시
  checkIsAllCompleted(); //전체 todos의 완료 상태를 파악하려 전체 완료 처리 버튼 css반영
}

const updateTodo = (text, todoId) => {  //text = 수정될 할 일의 내용, todoId = 수정될 할 일의 id
  const currentTodos = getAllTodos();
  const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
  setTodos(newTodos);
  paintTodos();
};

const onDnclickTodo = (e, todoId)=>{
  const todoElem = e.target;
  const inputText = e.target.innerText;
  const todoItemElem = todoElem.parentNode;
  const inputElem = document.createElement('input');
  inputElem.value = inputText;
  inputElem.classList.add('edit_input');

  inputElem.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
      updateTodo(e.target.value, todoId); //todo 수정
      document.body.removeEventListener('click', onClickBody); //이벤트리스너 제거
    }
  })

  //todoItemElem요소를 제외한 영역을 클릭 시, 수정모드 종료
  const onClickBody = (e)=>{
    if(e.target !== inputElem){
      todoItemElem.removeChild(inputElem);
      document.body.removeEventListener('click', onClickBody);
    }
  }

  //body에 클릭에 대한 이벤트 리스너 등록
  document.body.addEventListener('click',onClickBody);
  todoItemElem.appendChild(inputElem);  //todoItemElem요소에 자식요소로 inputElem요소 추가

}

const clearCompletedTodos= ()=>{
  const newTodos = getActiveTodos();
  setTodos(newTodos);
  paintTodos();
}

const paintTodo = (todo)=>{
  //"todo_item"에 해당하는 html을 그려서 "todo_list"에 추가하기
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo_item');

    todoItem.setAttribute('data-id', todo.id);

    const checkBoxElem = document.createElement('div');
    checkBoxElem.classList.add('checkbox');
    checkBoxElem.addEventListener('click', ()=>completeTodo(todo.id));

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick',(e)=> onDnclickTodo(e, todo.id)) 
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click',()=> deletTodo(todo.id));
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted){
      todoItem.classList.add('checked');
      // todoElem.classList.add('checked');
      checkBoxElem.innerText = '✔';
    }

    todoItem.appendChild(checkBoxElem);
    todoItem.appendChild(todoElem);
    todoItem.appendChild(delBtnElem);

    todoList.appendChild(todoItem);
}

const paintTodos = ()=>{
  todoList.innerHTML = ''; //todoList요소 안의 html 초기화

  switch(currentShowType){
    case 'all':
      const allTodos = getAllTodos();
      allTodos.forEach(todo => { paintTodo(todo); });
      break;
    case 'active':
      const activeTodos = getActiveTodos();
      activeTodos.forEach(todo => { paintTodo(todo); });
      break;
    case 'completed':
      const completedTodos = getCompletedTodos();
      completedTodos.forEach(todo => { paintTodo(todo); });
      break;

      default:
        break;
  }
}

const onClickShowTodosType = (e)=>{
  const currentBtnElem = e.target; //현재 클릭된 버튼
  const newShowType = currentBtnElem.dataset.type; //현재 클릭된 버튼의 data-type

  if(currentShowType === newShowType) return;

  const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
  preBtnElem.classList.remove('selected');

  currentBtnElem.classList.add('selected');
  setCurrentShowType(newShowType);
  paintTodos(); //재 렌더링
}

const init = ()=>{
  todoInput.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
      appendTodos(e.target.value); //appendTodos에 value값을 넘겨주고
      todoInput.value = ''; //todoInput의 value값을 초기화
    }
  })

  comlpeteAllBtnElm.addEventListener('click', onClickCompleteAll);
  showAllBtnElem.addEventListener('click', onClickShowTodosType);
  showActiveBtnElem.addEventListener('click', onClickShowTodosType);
  showCompleteBtnElem.addEventListener('click', onClickShowTodosType);
  clearCompleteBtnElem.addEventListener('click', clearCompletedTodos);
  setLeftItems(); //남은 할 일 개수 표시
}

init();
