"use client";

import React from "react";

export interface MenuItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    action: () => void;
    dividerAfter?: boolean;
}

interface MenuProps {
    title?: string;
    items: MenuItem[];
    onClose: () => void;
}

export default function MenuWindow({ title, items, onClose }: MenuProps) {
    return (
        <div className="w-full max-w-64 shadow-lg border border-border rounded-lg bg-card p-2 mb-2">
            {/* title */}
            {title && (
                <div className="text-foreground text-sm font-medium px-2 py-1.5 mb-1">
                    {title}
                </div>
            )}

            {/* menu items */}
            <div className="flex flex-col">
                {items.map((item) => (
                    <React.Fragment key={item.id}>
                        <button
                            onClick={() => {
                                item.action();
                            }}
                            className="flex items-center gap-3 w-full px-2 py-2 rounded-md 
                         hover:bg-accent text-foreground text-sm transition-colors
                         cursor-pointer text-left"
                        >
                            {item.icon && (
                                <span className="text-muted-foreground">{item.icon}</span>
                            )}
                            <span>{item.label}</span>
                        </button>
                        {item.dividerAfter && <hr className="border-border my-1" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
