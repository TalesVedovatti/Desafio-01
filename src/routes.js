import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks/'),
        handler: (req, res) => {
            const { search } = req.query;
            
            const tasks = database.select('tasks', {
                title: search,
                description: search,
            })
            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/'),
        handler: (req, res) => {
            const { title, description } = req.body;
            if(!title) {
                return res.writeHead(400).end(JSON.stringify({ message : 'title is required'}))
            }
            if(!description) {
                return res.writeHead(400).end(JSON.stringify({ message : 'description is required'}))
            }
            const created_at = new Date();
            const updated_at = created_at;
            const task = {
                id: randomUUID(),
                title,
                description,
                created_at,
                updated_at,
                completed_at: null
            }
            console.log(task)
            database.insert('tasks', task)
            return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',   
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;

            const searchData = id ? {
                id: id
            }: null;
            if (!searchData) {
                return res.writeHead(400).end(JSON.stringify({ message : 'id is required'}))        
            }
            const taskToDelete = database.select('tasks', searchData)
            if (!taskToDelete) {
                return res.writeHead(404).end(JSON.stringify({ message : 'task not found'}))
            }
            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params;
            const { title, description } = req.body;
            if(!title) {
                return res.writeHead(400).end(JSON.stringify({ message : 'title is required'}))
            }
            if(!description) {
                return res.writeHead(400).end(JSON.stringify({ message : 'description is required'}))
            }
            const searchData = id ? {
                id: id
            }: null;
            if (!searchData) {
                return res.writeHead(400).end(JSON.stringify({ message : 'id is required'}))        
            }
            const taskToUpdate = database.select('tasks', searchData)
            if (!taskToUpdate) {
                return res.writeHead(404).end(JSON.stringify({ message : 'task not found'}))
            }
            database.update('tasks', id, {title, description, updated_at : new Date()})

            return res.writeHead(204).end()
        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params;
            const searchData = id ? {
                id: id
            }: null;
            if (!searchData) {
                return res.writeHead(400).end(JSON.stringify({ message : 'title is required'}))        
            }
            const taskToPatch = database.select('tasks', searchData);
            if(!taskToPatch) {
                return res.writeHead(404).end(JSON.stringify({ message : 'task not found'}))
            }
            const isTaskCompleted = !!taskToPatch.completed_at 
            const completed_at = isTaskCompleted ? null : new Date()
            const updated_at = new Date()

            database.update('tasks', id, {completed_at, updated_at})
            return res.writeHead(204).end()
        }
    }

]