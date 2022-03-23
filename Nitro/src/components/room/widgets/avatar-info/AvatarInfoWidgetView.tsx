import { RoomEnterEffect, RoomObjectCategory } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo, useState } from 'react';
import { GetRoomSession, GetSessionDataManager, RoomWidgetObjectNameEvent, RoomWidgetRoomObjectMessage, RoomWidgetUpdateDanceStatusEvent, RoomWidgetUpdateDecorateModeEvent, RoomWidgetUpdateInfostandEvent, RoomWidgetUpdateInfostandFurniEvent, RoomWidgetUpdateInfostandPetEvent, RoomWidgetUpdateInfostandRentableBotEvent, RoomWidgetUpdateInfostandUserEvent, RoomWidgetUpdateRentableBotChatEvent, RoomWidgetUpdateRoomEngineEvent, RoomWidgetUpdateRoomObjectEvent, RoomWidgetUseProductBubbleEvent, UseProductItem } from '../../../../api';
import { UseEventDispatcherHook } from '../../../../hooks';
import { useRoomContext } from '../../RoomContext';
import { AvatarInfoRentableBotChatView } from './AvatarInfoRentableBotChatView';
import { AvatarInfoUseProductConfirmView } from './AvatarInfoUseProductConfirmView';
import { AvatarInfoUseProductView } from './AvatarInfoUseProductView';
import { AvatarInfoWidgetAvatarView } from './AvatarInfoWidgetAvatarView';
import { AvatarInfoWidgetDecorateView } from './AvatarInfoWidgetDecorateView';
import { AvatarInfoWidgetNameView } from './AvatarInfoWidgetNameView';
import { AvatarInfoWidgetOwnAvatarView } from './AvatarInfoWidgetOwnAvatarView';
import { AvatarInfoWidgetOwnPetView } from './AvatarInfoWidgetOwnPetView';
import { AvatarInfoWidgetPetView } from './AvatarInfoWidgetPetView';
import { AvatarInfoWidgetRentableBotView } from './AvatarInfoWidgetRentableBotView';

export const AvatarInfoWidgetView: FC<{}> = props =>
{
    const [ name, setName ] = useState<RoomWidgetObjectNameEvent>(null);
    const [ nameBubbles, setNameBubbles ] = useState<RoomWidgetObjectNameEvent[]>([]);
    const [ productBubbles, setProductBubbles ] = useState<UseProductItem[]>([]);
    const [ confirmingProduct, setConfirmingProduct ] = useState<UseProductItem>(null);
    const [ infoStandEvent, setInfoStandEvent ] = useState<RoomWidgetUpdateInfostandEvent>(null);
    const [ isGameMode, setGameMode ] = useState(false);
    const [ isDancing, setIsDancing ] = useState(false);
    const [ isDecorating, setIsDecorating ] = useState(false);
    const [ rentableBotChatEvent, setRentableBotChatEvent ] = useState<RoomWidgetUpdateRentableBotChatEvent>(null);
    const { roomSession = null, eventDispatcher = null, widgetHandler = null } = useRoomContext();

    const removeNameBubble = useCallback((index: number) =>
    {
        setNameBubbles(prevValue =>
            {
                const newValue = [ ...prevValue ];

                newValue.splice(index, 1);

                return newValue;
            });
    }, []);

    const removeProductBubble = useCallback((index: number) =>
    {
        setProductBubbles(prevValue =>
            {
                const newValue = [ ...prevValue ];
                const item = newValue.splice(index, 1)[0];

                if(confirmingProduct === item) setConfirmingProduct(null);

                return newValue;
            });
    }, [ confirmingProduct ]);

    const clearProductBubbles = useCallback(() =>
    {
        setProductBubbles([]);
    }, []);

    const clearInfoStandEvent = useCallback(() =>
    {
        setInfoStandEvent(null);
    }, []);

    const clearName = useCallback(() =>
    {
        setName(null);
    }, []);

    const updateConfirmingProduct = useCallback((product: UseProductItem) =>
    {
        setConfirmingProduct(product);
        setProductBubbles([]);
    }, []);

    const onRoomWidgetRoomEngineUpdateEvent = useCallback((event: RoomWidgetUpdateRoomEngineEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateRoomEngineEvent.NORMAL_MODE: {
                if(isGameMode) setGameMode(false);
                return;
            }
            case RoomWidgetUpdateRoomEngineEvent.GAME_MODE: {
                if(!isGameMode) setGameMode(true);
                return;
            }
        }
    }, [ isGameMode ]);

    UseEventDispatcherHook(RoomWidgetUpdateRoomEngineEvent.NORMAL_MODE, eventDispatcher, onRoomWidgetRoomEngineUpdateEvent);
    UseEventDispatcherHook(RoomWidgetUpdateRoomEngineEvent.GAME_MODE, eventDispatcher, onRoomWidgetRoomEngineUpdateEvent);

    const onRoomObjectRemoved = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(name)
        {
            if(event.id === name.id) setName(null);
        }

        if(event.category === RoomObjectCategory.UNIT)
        {
            const nameBubbleIndex = nameBubbles.findIndex(bubble =>
                {
                    return (bubble.roomIndex === event.id);
                });
    
            if(nameBubbleIndex > -1) removeNameBubble(nameBubbleIndex);

            if(productBubbles.length)
            {
                setProductBubbles(prevValue =>
                    {
                        return prevValue.filter(bubble =>
                            {
                                return (bubble.id !== event.id);
                            });
                    });
            }
        }

        else if(event.category === RoomObjectCategory.FLOOR)
        {
            if(productBubbles.length)
            {
                setProductBubbles(prevValue =>
                    {
                        return prevValue.filter(bubble =>
                            {
                                return (bubble.requestRoomObjectId !== event.id);
                            });
                    });
            }
        }

        if(infoStandEvent)
        {
            if(infoStandEvent instanceof RoomWidgetUpdateInfostandFurniEvent)
            {
                if(infoStandEvent.id === event.id) clearInfoStandEvent();
            }

            else if((infoStandEvent instanceof RoomWidgetUpdateInfostandUserEvent) || (infoStandEvent instanceof RoomWidgetUpdateInfostandRentableBotEvent))
            {
                if(infoStandEvent.roomIndex === event.id) clearInfoStandEvent();
            }

            else if(infoStandEvent instanceof RoomWidgetUpdateInfostandPetEvent)
            {
                if(infoStandEvent.roomIndex === event.id) clearInfoStandEvent();
            }
        }
    }, [ name, infoStandEvent, nameBubbles, productBubbles, removeNameBubble, clearInfoStandEvent ]);

    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.USER_REMOVED, eventDispatcher, onRoomObjectRemoved);
    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.FURNI_REMOVED, eventDispatcher, onRoomObjectRemoved);

    const onObjectRolled = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER: {
                const roomObjectEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                if(infoStandEvent) return;

                widgetHandler.processWidgetMessage(new RoomWidgetRoomObjectMessage(RoomWidgetRoomObjectMessage.GET_OBJECT_NAME, roomObjectEvent.id, roomObjectEvent.category));

                return;
            }
            case RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT: {
                const roomObjectEvent = (event as RoomWidgetUpdateRoomObjectEvent);

                if(!name || (name.roomIndex !== roomObjectEvent.id)) return;

                setName(null);

                return;
            }
        }
    }, [ infoStandEvent, name, widgetHandler ]);

    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OVER, eventDispatcher, onObjectRolled);
    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_ROLL_OUT, eventDispatcher, onObjectRolled);

    const onObjectDeselected = useCallback((event: RoomWidgetUpdateRoomObjectEvent) =>
    {
        if(infoStandEvent) clearInfoStandEvent();
        if(productBubbles.length) setProductBubbles([]);
    }, [ infoStandEvent, productBubbles, clearInfoStandEvent ]);

    UseEventDispatcherHook(RoomWidgetUpdateRoomObjectEvent.OBJECT_DESELECTED, eventDispatcher, onObjectDeselected);

    const onRoomWidgetObjectNameEvent = useCallback((event: RoomWidgetObjectNameEvent) =>
    {
        if(event.category !== RoomObjectCategory.UNIT) return;

        setName(event);
        clearProductBubbles();
    }, [ clearProductBubbles ]);

    UseEventDispatcherHook(RoomWidgetObjectNameEvent.TYPE, eventDispatcher, onRoomWidgetObjectNameEvent);

    const onRoomWidgetUpdateInfostandEvent = useCallback((event: RoomWidgetUpdateInfostandEvent) =>
    {
        if(name) setName(null);

        if(event.type === RoomWidgetUpdateInfostandFurniEvent.FURNI) clearInfoStandEvent();
        else setInfoStandEvent(event);

        clearProductBubbles();
    }, [ name, clearInfoStandEvent, clearProductBubbles ]);

    UseEventDispatcherHook(RoomWidgetUpdateInfostandFurniEvent.FURNI, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    UseEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.OWN_USER, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    UseEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.PEER, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    UseEventDispatcherHook(RoomWidgetUpdateInfostandUserEvent.BOT, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    UseEventDispatcherHook(RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT, eventDispatcher, onRoomWidgetUpdateInfostandEvent);
    UseEventDispatcherHook(RoomWidgetUpdateInfostandPetEvent.PET_INFO, eventDispatcher, onRoomWidgetUpdateInfostandEvent);

    const onRoomWidgetUpdateDanceStatusEvent = useCallback((event: RoomWidgetUpdateDanceStatusEvent) =>
    {
        setIsDancing(event.isDancing);
    }, []);

    UseEventDispatcherHook(RoomWidgetUpdateDanceStatusEvent.UPDATE_DANCE, eventDispatcher, onRoomWidgetUpdateDanceStatusEvent);

    const onRoomWidgetUpdateRentableBotChatEvent = useCallback((event: RoomWidgetUpdateRentableBotChatEvent) =>
    {
        setRentableBotChatEvent(event);
    }, []);

    UseEventDispatcherHook(RoomWidgetUpdateRentableBotChatEvent.UPDATE_CHAT, eventDispatcher, onRoomWidgetUpdateRentableBotChatEvent);

    const onRoomWidgetUseProductBubbleEvent = useCallback((event: RoomWidgetUseProductBubbleEvent) =>
    {
        setConfirmingProduct(null);
        setProductBubbles(prevValue =>
            {
                const newBubbles = [ ...prevValue ];

                for(const item of event.items)
                {
                    const index = newBubbles.findIndex(bubble => (bubble.id === item.id));

                    if(index > -1) newBubbles.splice(index, 1);

                    newBubbles.push(item);
                }

                return newBubbles;
            });
    }, []);

    UseEventDispatcherHook(RoomWidgetUseProductBubbleEvent.USE_PRODUCT_BUBBLES, eventDispatcher, onRoomWidgetUseProductBubbleEvent);

    // const onFriendEnteredRoomEvent = useCallback((event: FriendEnteredRoomEvent) =>
    // {
    //     setNameBubbles(prevValue =>
    //         {
    //             return [ ...prevValue, event  ];
    //         })
    // }, []);

    // useUiEvent(FriendEnteredRoomEvent.ENTERED, onFriendEnteredRoomEvent);

    const onRoomWidgetUpdateDecorateModeEvent = useCallback((event: RoomWidgetUpdateDecorateModeEvent) =>
    {
        setIsDecorating(event.isDecorating);
    }, []);

    UseEventDispatcherHook(RoomWidgetUpdateDecorateModeEvent.UPDATE_DECORATE, eventDispatcher, onRoomWidgetUpdateDecorateModeEvent);

    const decorateView = useMemo(() =>
    {
        GetRoomSession().isDecorating = isDecorating;

        if(!isDecorating) return null;

        const userId = GetSessionDataManager().userId;
        const userName = GetSessionDataManager().userName;
        const roomIndex = GetRoomSession().ownRoomIndex;

        return <AvatarInfoWidgetDecorateView userId={ userId } userName={ userName } roomIndex={ roomIndex } />;
    }, [ isDecorating ]);

    const currentView = useMemo(() =>
    {
        if(isGameMode) return null;

        if(decorateView) return decorateView;

        if(name)
        {
            const nameBubbleIndex = nameBubbles.findIndex(bubble =>
                {
                    return (bubble.roomIndex === name.roomIndex);
                });

            if(nameBubbleIndex > -1) removeNameBubble(nameBubbleIndex);

            return <AvatarInfoWidgetNameView nameData={ name } close={ clearName }  />;
        }

        if(infoStandEvent)
        {
            switch(infoStandEvent.type)
            {
                case RoomWidgetUpdateInfostandUserEvent.OWN_USER:
                case RoomWidgetUpdateInfostandUserEvent.PEER: {
                    const event = (infoStandEvent as RoomWidgetUpdateInfostandUserEvent);

                    if(event.isSpectatorMode) return null;

                    const nameBubbleIndex = nameBubbles.findIndex(bubble =>
                        {
                            return (bubble.roomIndex === event.roomIndex);
                        });

                    if(nameBubbleIndex > -1) removeNameBubble(nameBubbleIndex);

                    if(event.isOwnUser)
                    {
                        if(RoomEnterEffect.isRunning()) return null;

                        return <AvatarInfoWidgetOwnAvatarView userData={ event } isDancing={ isDancing } close={ clearInfoStandEvent } />;
                    }

                    return <AvatarInfoWidgetAvatarView userData={ event } close={ clearInfoStandEvent } />;
                }
                case RoomWidgetUpdateInfostandPetEvent.PET_INFO: {
                    const event = (infoStandEvent as RoomWidgetUpdateInfostandPetEvent);

                    if(event.isOwner)
                    {
                        return <AvatarInfoWidgetOwnPetView petData={ event } close={ clearInfoStandEvent } />;
                    }

                    return <AvatarInfoWidgetPetView petData={ event } close={ clearInfoStandEvent } />;
                }
                case RoomWidgetUpdateInfostandRentableBotEvent.RENTABLE_BOT: {
                    return <AvatarInfoWidgetRentableBotView rentableBotData={ (infoStandEvent as RoomWidgetUpdateInfostandRentableBotEvent) } close={ clearInfoStandEvent } />
                }
                case RoomWidgetUpdateInfostandFurniEvent.FURNI: {
                    return null;
                }
            }
        }

        return null;
    }, [ isGameMode, decorateView, name, nameBubbles, isDancing, infoStandEvent, clearName, clearInfoStandEvent, removeNameBubble ]);

    return (
        <>
            { currentView }
            { (nameBubbles.length > 0) && nameBubbles.map((name, index) =>
                {
                    return <AvatarInfoWidgetNameView key={ index } nameData={ name } close={ () => removeNameBubble(index) }  />;
                }) }
            { (productBubbles.length > 0) && productBubbles.map((item, index) =>
                {
                    return <AvatarInfoUseProductView key={ item.id } item={ item } updateConfirmingProduct={ updateConfirmingProduct } close={ () => removeProductBubble(index) }  />;
                }) }
            { rentableBotChatEvent && <AvatarInfoRentableBotChatView chatEvent={ rentableBotChatEvent } close={ () => setRentableBotChatEvent(null)}/> }
            { confirmingProduct && <AvatarInfoUseProductConfirmView item={ confirmingProduct } close={ () => setConfirmingProduct(null) } /> }
        </>
    )
}
