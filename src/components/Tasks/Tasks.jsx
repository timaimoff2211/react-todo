import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './Tasks.scss';
import editSvg from '../../assets/img/edit.svg';
import AddtaskForm from './AddTaskForm';
import Task from './Task';

const Tasks = ({ list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onCompleteTask, withoutEmpty }) => {
    
    const editTitle = () => {
        const newTitle = window.prompt('Введите название списка', list.name);
        if(newTitle) {
            onEditTitle(list.id, newTitle);
            axios
            .patch('http://localhost:3001/lists/' + list.id, {
                name: newTitle
            })
            .catch(() => {
                alert('Не удалось обновить название списка');
            })
        }
    };

    return (
        <div className="tasks">
            <Link to={`/lists/${list.id}`}>
                <h2 style={{ color: list.color.hex }} className="tasks__title">
                    {list.name}
                    <img 
                        onClick={editTitle} 
                        src={editSvg} alt="edit icon"
                    />
                </h2>
            </Link>
            
            <div className="tasks__items">
            {!withoutEmpty && list.tasks && !list.tasks.length && <h2 className="tasks__items-no-tasks">Задачи отсутствуют</h2>}
            {
                list.tasks && list.tasks.map(task => (
                    <Task 
                        key={task.id} 
                        list={list} {...task} 
                        onRemove={onRemoveTask} 
                        onEdit={onEditTask} 
                        onComplete={onCompleteTask}
                    />
                ))
            }


            </div>
            <AddtaskForm key={list.id} list={list} onAddTask={onAddTask} />
        </div>
    )
}

export default Tasks;