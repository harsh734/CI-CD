import { useState } from 'react';

export default function TaskInput({ onAdd }) {
  const [title,    setTitle]    = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority, category);
    setTitle('');
  };

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <input
        className="task-input"
        type="text"
        placeholder="Add a new task… press Enter or click +"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        className="task-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>
      <select
        className="task-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="work">💼 Work</option>
        <option value="personal">🙂 Personal</option>
        <option value="health">💪 Health</option>
        <option value="learning">📚 Learning</option>
        <option value="shopping">🛒 Shopping</option>
      </select>
      <button className="task-add-btn" type="submit">＋</button>
    </form>
  );
}
