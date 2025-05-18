import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggableMarkdownItem } from './DraggableMarkdownItem';

interface ReorderItem {
  id: string;
  content: string;
}

interface ReorderContentProps {
  items: ReorderItem[];
  disabled: boolean;
  highlight: 'none' | 'green' | 'blue' | 'red';
  onOrderChange?: (newItems: ReorderItem[]) => void;
  showHandles?: boolean;
}

export function ReorderContent({ 
  items, 
  disabled = false,
  highlight = 'none',
  onOrderChange,
  showHandles = false
}: ReorderContentProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    if (disabled) return;
    
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      onOrderChange?.(newItems);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-2">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <DraggableMarkdownItem 
              key={item.id} 
              id={item.id}
              content={item.content}
              disabled={disabled}
              highlight={highlight}
              sortable={true}
              showHandle={showHandles}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
} 