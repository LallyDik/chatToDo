tasks = []

def get_tasks():
    return tasks

def add_task(task):
    tasks.append(task)
    return task

def update_task(task_id, updated_task):
    for i, task in enumerate(tasks):
        if task['id'] == task_id:
            tasks[i].update(updated_task)
            return tasks[i]
    return None

def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
