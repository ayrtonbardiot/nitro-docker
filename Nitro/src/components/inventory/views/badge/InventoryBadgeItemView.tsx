import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, MouseEvent } from 'react';
import { LayoutBadgeImageView, LayoutGridItem } from '../../../../common';
import { useInventoryContext } from '../../InventoryContext';
import { InventoryBadgeActions } from '../../reducers/InventoryBadgeReducer';

export interface InventoryBadgeItemViewProps
{
    badgeCode: string;
}

export const InventoryBadgeItemView: FC<InventoryBadgeItemViewProps> = props =>
{
    const { badgeCode = null } = props;
    const { badgeState = null, dispatchBadgeState = null } = useInventoryContext();

    const onMouseEvent = (event: MouseEvent) =>
    {
        switch(event.type)
        {
            case MouseEventType.MOUSE_DOWN:
                dispatchBadgeState({
                    type: InventoryBadgeActions.SET_BADGE,
                    payload: { badgeCode }
                });
        }
    }

    return (
        <LayoutGridItem itemActive={ (badgeState.badge === badgeCode) } onMouseDown={ onMouseEvent }> 
            <LayoutBadgeImageView badgeCode={ badgeCode } />
        </LayoutGridItem>
    );
}
