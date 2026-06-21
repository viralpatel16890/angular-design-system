import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { AvatarSize, AvatarShape, AvatarStatus } from './avatar.types';

@Component({
  selector: 'ds-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  src    = input('');
  alt    = input('');
  name   = input('');
  size   = input<AvatarSize>('md');
  shape  = input<AvatarShape>('circle');
  status = input<AvatarStatus | null>(null);
  color  = input('');

  imgError = signal(false);

  initials = computed(() => {
    const n = this.name().trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : n.slice(0, 2).toUpperCase();
  });

  showImage = computed(() => !!this.src() && !this.imgError());
  showInitials = computed(() => !this.showImage() && !!this.initials());
  showFallback = computed(() => !this.showImage() && !this.initials());

  hostClasses = computed(() => [
    'ds-avatar',
    `ds-avatar--${this.size()}`,
    `ds-avatar--${this.shape()}`,
    this.color() ? `ds-avatar--color-${this.color()}` : '',
  ].filter(Boolean).join(' '));

  onImgError(): void { this.imgError.set(true); }
}
