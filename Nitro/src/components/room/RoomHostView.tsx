import { IRoomSession, RoomEngineEvent, RoomId, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useCallback, useState } from 'react';
import { GetRoomSession, SetActiveRoomId, StartRoomSession } from '../../api';
import { Base, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { UseRoomEngineEvent, UseRoomSessionManagerEvent } from '../../hooks';
import { RoomView } from './RoomView';

export const RoomHostView: FC<{}> = props =>
{
    const [ roomSession, setRoomSession ] = useState<IRoomSession>(null);

    const onRoomEngineEvent = useCallback((event: RoomEngineEvent) =>
    {
        if(RoomId.isRoomPreviewerId(event.roomId)) return;

        const session = GetRoomSession();

        if(!session) return;

        switch(event.type)
        {
            case RoomEngineEvent.INITIALIZED:
                SetActiveRoomId(event.roomId);
                setRoomSession(session);
                return;
            case RoomEngineEvent.DISPOSED:
                setRoomSession(null);
                return;
        }
    }, []);

    UseRoomEngineEvent(RoomEngineEvent.INITIALIZED, onRoomEngineEvent);
    UseRoomEngineEvent(RoomEngineEvent.DISPOSED, onRoomEngineEvent);

    const onRoomSessionEvent = useCallback((event: RoomSessionEvent) =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                StartRoomSession(event.session);
                return;
            case RoomSessionEvent.ENDED:
                setRoomSession(null);
                return;
        }
    }, []);

    UseRoomSessionManagerEvent(RoomSessionEvent.CREATED, onRoomSessionEvent);
    UseRoomSessionManagerEvent(RoomSessionEvent.ENDED, onRoomSessionEvent);

    return (
        <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ !!roomSession } timeout={ 300 }>
            <Base fit>
                <RoomView roomSession={ roomSession } />
            </Base>
        </TransitionAnimation>
    );
}
