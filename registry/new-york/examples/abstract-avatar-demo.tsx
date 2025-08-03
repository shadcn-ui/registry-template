import { AbstractAvatar } from "@/registry/new-york/blocks/abstract-avatar/abstract-avatar";

export default function AbstractAvatarDemo() {
  return (
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
  );
}
