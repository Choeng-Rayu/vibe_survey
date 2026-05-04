"use client";

import React, { ReactNode } from "react";
import {
  DndContext as DndKitContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface DndContextValue {
  handleDragEnd: (event: DragEndEvent) => void;
}

interface DndProviderProps {
  children: ReactNode;
  onReorder: (oldIndex: number, newIndex: number) => void;
  isPreviewMode?: boolean;
}

export function DndProvider({
  children,
  onReorder,
  isPreviewMode = false,
}: DndProviderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isPreviewMode) return;

    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = active.data.current?.sortable?.index ?? 0;
      const overIndex = over.data.current?.sortable?.index ?? 0;

      onReorder(activeIndex, overIndex);
    }
  };

  return (
    <DndKitContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={[]}
        strategy={verticalListSortingStrategy}
        disabled={isPreviewMode}
      >
        {children}
      </SortableContext>
    </DndKitContext>
  );
}
