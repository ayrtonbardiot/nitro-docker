import { FC, useCallback, useState } from 'react';
import { IPhotoData, LocalizeText, RoomWidgetUpdateExternalImageEvent } from '../../../../../api';
import { Flex, NitroCardContentView, NitroCardHeaderView, NitroCardView, Text } from '../../../../../common';
import { BatchUpdates, UseEventDispatcherHook } from '../../../../../hooks';
import { useRoomContext } from '../../../RoomContext';

export const FurnitureExternalImageView: FC<{}> = props =>
{
    const [ objectId, setObjectId ] = useState(-1);
    const [ photoData, setPhotoData ] = useState<IPhotoData>(null);
    const { eventDispatcher = null } = useRoomContext();
    
    const close = () =>
    {
        setObjectId(-1);
        setPhotoData(null)
    }

    const onRoomWidgetUpdateExternalImageEvent = useCallback((event: RoomWidgetUpdateExternalImageEvent) =>
    {
        switch(event.type)
        {
            case RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE: {

                BatchUpdates(() =>
                {
                    setObjectId(event.objectId);
                    setPhotoData(event.photoData);
                });
            }
        }
    }, []);

    UseEventDispatcherHook(RoomWidgetUpdateExternalImageEvent.UPDATE_EXTERNAL_IMAGE, eventDispatcher, onRoomWidgetUpdateExternalImageEvent);

    if((objectId === -1) || !photoData) return null;
    
    return (
        <NitroCardView className="nitro-external-image-widget" theme="primary-slim">
            <NitroCardHeaderView headerText={ '' } onCloseClick={ close } />
            <NitroCardContentView>
                <Flex center className="picture-preview border border-black" style={ photoData.w ? { backgroundImage: 'url(' + photoData.w + ')' } : {} }>
                    { !photoData.w &&
                        <Text bold>{ LocalizeText('camera.loading') }</Text> }
                </Flex>
                { photoData.m && photoData.m.length &&
                    <Text center>{ photoData.m }</Text> }
                <Flex alignItems="center" justifyContent="between">
                    <Text>{ (photoData.n || '') }</Text>
                    <Text>{ new Date(photoData.t * 1000).toLocaleDateString() }</Text>
                </Flex>
            </NitroCardContentView>
        </NitroCardView>
    );
}
