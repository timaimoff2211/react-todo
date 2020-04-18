import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, useHistory } from 'react-router-dom';

import { List, AddList, Tasks } from './components';
import listSvg from './assets/img/list.svg';



const App = () => {
  
  const [lists, setLists] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  let history = useHistory();

  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setLists(data);
    });
    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    })
  }, []);

  const onAddList = (obj) => {
    const newLists = [...lists, obj];
    setLists(newLists);
  };

  const onAddTask = (listId, taskObj) => {
    const newList = lists.map(item => {
      if(item.id === listId) {
        item.tasks = [...item.tasks, taskObj];
      }
      return item;
    });

    setLists(newList);
  };

  const onRemoveTask = (listId, taskId) => {
    if(window.confirm('Вы действительно хотите удалить задачу?')) {
      const updatedList = lists.map(item => {
        if(item.id === listId) {
          item.tasks = item.tasks.filter(elem => elem.id !== taskId);
        }
        return item;
      });
      setLists(updatedList);
      axios
        .delete('http://localhost:3001/tasks/' + taskId)
        .catch(() => {
            alert('Не удалось удалить задачу');
        });
    }
  };

  const onEditTask = (listId, taskObj) => {
    const newTaskText = window.prompt('Текст задачи', taskObj.text);

    if(!newTaskText) return;

    const newList = lists.map(item => {
      if(item.id === listId) {
        item.tasks = item.tasks.map(task => {
          if(task.id === taskObj.id) task.text = newTaskText;
          return task;
        })
      }
      return item;
    })
    setLists(newList);

    axios
      .patch('http://localhost:3001/tasks/' + taskObj.id, { text: newTaskText })
      .catch(() => {
          alert('Не удалось изменить текст задачи!');
      });
  };

  const onEditListTitle = (id, title) => {
    console.log(id, title);

    const newList = lists.map(item => {
      if(item.id === id) {
        item.name = title;
      }
      return item;
    });

  setLists(newList);
  };

  const onCompleteTask = (listId, taskId, completed) => {
    console.log(taskId);
    const newList = lists.map(item => {
      if(item.id === listId) {
        item.tasks = item.tasks.map(task => {
          if(task.id === taskId) task.completed = completed;
          return task;
        })
      }
      return item;
    })
    setLists(newList);

    axios
      .patch('http://localhost:3001/tasks/' + taskId, { completed: completed })
      .catch(() => {
          alert('Не удалось отметить задачу!');
      });
  };

  const allTasks = [
    {
      active: history.location.pathname === '/',
      icon: (<img src={listSvg} alt="List icon" />),
      name: 'Все задачи'
    }
  ];

  useEffect(() => {
    const listId = history.location.pathname.split('lists/')[1];

    if(lists) {
      const currList = lists.find(elem => elem.id === Number(listId));
      setActiveItem(currList);
    }

  }, [lists, history.location.pathname]);

  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List onClickItem={item => {
              history.push(`/`);
            }}
              items={allTasks} 
        />
        {lists ? (
          <List 
            items={lists} 
            onRemove={(id) => {
              const newList = lists.filter(item => item.id !== id);
              setLists(newList);
            }} 
            onClickItem={item => {
              history.push(`/lists/${item.id}`);
            }}
            activeItem={activeItem}
            isRemovable 
          />) : (
            'Загрузка...'
          )
        }
        <AddList onAdd={onAddList} colors={colors} />
      </div>

      <div className="todo__tasks">
        <Route exact path="/">
          {
            lists && lists.map(list => <Tasks
              key={list.id}
              list={list} 
              onEditTitle={onEditListTitle} 
              onAddTask={onAddTask}
              onRemoveTask={onRemoveTask}
              onEditTask={onEditTask}
              onCompleteTask={onCompleteTask}
              withoutEmpty
          />)
          }
        </Route>
        <Route path="/lists/:id">
        {lists && activeItem && 
        <Tasks
            list={activeItem} 
            onEditTitle={onEditListTitle} 
            onAddTask={onAddTask}
            onRemoveTask={onRemoveTask}
            onEditTask={onEditTask}
            onCompleteTask={onCompleteTask}
        />}
        </Route>
      </div>
    </div>
  );
}

export default App;
