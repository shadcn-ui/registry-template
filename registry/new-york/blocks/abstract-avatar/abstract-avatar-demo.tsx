"use client";

import { AbstractAvatar } from "./abstract-avatar";

export function AbstractAvatarDemo() {
  return (
    <div className="flex flex-col gap-6">
      {/* No address - shows skeleton */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Connected Wallet Profile</span>
        <div className="flex items-center gap-4">
          <AbstractAvatar size="sm" />
          <AbstractAvatar size="md" />
          <AbstractAvatar size="lg" />
        </div>
      </div>

      {/* With sample addresses */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Example Profiles</span>
        <div className="flex items-center gap-4">
          <AbstractAvatar
            address="0x06639F064b82595F3BE7621F607F8e8726852fCf"
            size="sm"
          />
          <AbstractAvatar
            address="0x1C67724aCc76821C8aD1f1F87BA2751631BAbD0c"
            size="md"
          />
          <AbstractAvatar
            address="0x1BdE3D2861Cb5216Eb6Ec559aFdE7d44f385D4f6"
            size="lg"
          />
        </div>
      </div>
    </div>
  );
}