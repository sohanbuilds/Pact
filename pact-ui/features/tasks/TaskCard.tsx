import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TaskPriority } from '@/types';

interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const priorityColors = {
  [TaskPriority.LOW]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [TaskPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  [TaskPriority.HIGH]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskCard({ task, onUpdate, onDelete, canEdit = true, canDelete = true }: TaskCardProps) {
  const handleToggleComplete = async () => {
    if (onUpdate) {
      // For personal tasks, we need to update via API since completed is not in CreateTaskDto
      // This will be handled by the parent component
      onUpdate({ ...task, completed: !task.completed });
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className={task.completed ? 'opacity-60' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                disabled={!canEdit}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <h3 className={`font-semibold text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              
              {task.deadline && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  📅 {formatDate(task.deadline)}
                </span>
              )}

              {task.assignee && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  👤 {task.assignee.username}
                </span>
              )}

              {task.group && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  🏢 {task.group.name}
                </span>
              )}
            </div>
          </div>

          {(canEdit || canDelete) && (
            <div className="flex gap-2">
              {canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

