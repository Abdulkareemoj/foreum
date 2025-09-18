import { type Icon as IconType } from '@lucide/svelte';
export interface MultiSelectOption {
	label: string;
	value: string;
	icon?: typeof IconType;
	disabled?: boolean;
	style?: {
		badgeColor?: string;
		iconColor?: string;
		gradient?: string;
	};
}

export interface MultiSelectGroup {
	heading: string;
	options: MultiSelectOption[];
}
