/**
 * Icon configuration - aligned with Design System
 *
 * Scholar: GraduationCap (academic identity)
 * Institution: Landmark (formal institutional building)
 */

export const EntityIcons = {
  scholar: {
    large: { icon: 'GraduationCap', size: 'h-6 w-6', color: 'text-blue-600' },
    medium: { icon: 'GraduationCap', size: 'h-5 w-5', color: 'text-blue-600' },
    small: { icon: 'GraduationCap', size: 'h-4 w-4', color: 'text-blue-600' },
    xs: { icon: 'GraduationCap', size: 'h-3.5 w-3.5', color: 'text-blue-600' },
    white: { icon: 'GraduationCap', size: 'h-6 w-6', color: 'text-white' },
  },
  institution: {
    large: { icon: 'Landmark', size: 'h-6 w-6', color: 'text-indigo-600' },
    medium: { icon: 'Landmark', size: 'h-5 w-5', color: 'text-indigo-600' },
    small: { icon: 'Landmark', size: 'h-4 w-4', color: 'text-indigo-600' },
    xs: { icon: 'Landmark', size: 'h-3.5 w-3.5', color: 'text-indigo-600' },
    white: { icon: 'Landmark', size: 'h-6 w-6', color: 'text-white' },
  },
} as const;

export type EntityType = 'scholar' | 'institution';
export type IconSize = 'large' | 'medium' | 'small' | 'xs' | 'white';
