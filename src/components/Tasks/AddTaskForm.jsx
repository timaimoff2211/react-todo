import React, { useState } from 'react';
import axios from 'axios';

import addSvg from '../../assets/img/add.svg';



const AddtaskForm = ({ list, onAddTask }) => {
    const [taskForm, setTaskForm] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toggleVisibleForm = () => {
        setTaskForm(!taskForm);
        setInputValue('');
    }

    const addTask = () => {
        const obj = {
            listId: list.id,
            text: inputValue,
            completed: false
        };

        setIsLoading(true);
        axios
            .post('http://localhost:3001/tasks', obj)
            .then(({ data }) => {         
                onAddTask(list.id, data)
                toggleVisibleForm();
            })
            .catch(() => {
                alert('Ошибка при добавлении задачи!')
            })
            .finally(() => {
                setIsLoading(false);
            });

    }

    return (
        <div className="tasks__form">
            {!taskForm ? (

            <div onClick={toggleVisibleForm} className="tasks__form-new">
                <img src={addSvg} alt="add icon"/>
                <span>Новая задача</span>
            </div>

            ) : (

            <div className="tasks__form-block">
                <input 
                    value={inputValue}
                    type="text" 
                    className="field" 
                    placeholder="Текст задачи"
                    onChange={e => setInputValue(e.target.value)}
                />
                <button 
                    onClick={addTask}
                    className="button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Добавление...' : 'Добавить задачу'}
                </button>
                <button 
                    onClick={toggleVisibleForm} 
                    className="button button--grey"
                >
                    Отмена
                </button>
            </div>

            )}
        </div>
    )
};


export default AddtaskForm;