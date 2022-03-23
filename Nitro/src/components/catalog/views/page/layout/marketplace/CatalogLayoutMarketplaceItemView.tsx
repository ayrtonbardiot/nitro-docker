import { FC, useCallback, useMemo } from 'react';
import { GetRoomEngine, LocalizeText } from '../../../../../../api';
import { Button } from '../../../../../../common/Button';
import { Column } from '../../../../../../common/Column';
import { LayoutGridItem } from '../../../../../../common/layout/LayoutGridItem';
import { LayoutImage } from '../../../../../../common/layout/LayoutImage';
import { Text } from '../../../../../../common/Text';
import { MarketplaceOfferData } from './common/MarketplaceOfferData';
import { MarketPlaceOfferState } from './common/MarketplaceOfferState';

export interface MarketplaceItemViewProps
{
    offerData: MarketplaceOfferData;
    type?: number;
    onClick(offerData: MarketplaceOfferData): void;
}

export const OWN_OFFER = 1;
export const PUBLIC_OFFER = 2;

export const CatalogLayoutMarketplaceItemView: FC<MarketplaceItemViewProps> = props =>
{
    const { offerData = null, type = PUBLIC_OFFER, onClick = null } = props;

    const getImageUrlForOffer = useCallback( () =>
    {
        if(!offerData) return '';

        switch(offerData.furniType)
        {
            case MarketplaceOfferData.TYPE_FLOOR:
                return GetRoomEngine().getFurnitureFloorIconUrl(offerData.furniId);
            case MarketplaceOfferData.TYPE_WALL:
                return GetRoomEngine().getFurnitureWallIconUrl(offerData.furniId, offerData.extraData);
        }

        return '';
    }, [offerData]);
    
    const getMarketplaceOfferTitle = useMemo(() =>
    {
        if(!offerData) return '';

        // desc
        return LocalizeText(((offerData.furniType === 2) ? 'wallItem' : 'roomItem') + `.name.${ offerData.furniId }`);
    }, [ offerData ]);

    const offerTime = useCallback( () =>
    {
        if(!offerData) return '';

        if(offerData.status === MarketPlaceOfferState.SOLD) return LocalizeText('catalog.marketplace.offer.sold');

        if(offerData.timeLeftMinutes <= 0) return LocalizeText('catalog.marketplace.offer.expired');
        
        const time = Math.max(1, offerData.timeLeftMinutes);
        const hours = Math.floor(time / 60);
        const minutes =  time - (hours * 60);

        let text = minutes + ' ' + LocalizeText('catalog.marketplace.offer.minutes');
        if(hours > 0)
        {
            text = hours + ' ' + LocalizeText('catalog.marketplace.offer.hours') + ' ' + text;
        }

        return LocalizeText('catalog.marketplace.offer.time_left', ['time'], [text] );
    }, [offerData]);

    return (
        <LayoutGridItem center={ false } column={ false } alignItems="center" className="p-1">
            <LayoutImage imageUrl={ getImageUrlForOffer() } fit={ false } style={ { width: 50, height: 50 } } />
            <Column grow gap={ 0 }>
                <Text fontWeight="bold">{ getMarketplaceOfferTitle }</Text>
                { (type === OWN_OFFER) &&
                    <>
                        <Text>{ LocalizeText('catalog.marketplace.offer.price_own_item', [ 'price' ], [ offerData.price.toString() ]) }</Text>
                        <Text>{ offerTime() }</Text>
                    </> }
                { (type === PUBLIC_OFFER) &&
                    <>
                        <Text>{ LocalizeText('catalog.marketplace.offer.price_public_item', ['price', 'average'], [offerData.price.toString(), offerData.averagePrice.toString() ]) }</Text>
                        <Text>{ LocalizeText('catalog.marketplace.offer_count', ['count'], [offerData.offerCount.toString()]) }</Text>
                    </> }
            </Column>
            <Column gap={ 1 }>
                { ((type === OWN_OFFER) && (offerData.status !== MarketPlaceOfferState.SOLD)) &&
                    <Button variant="secondary" size="sm" onClick={ () => onClick(offerData) }>
                        { LocalizeText('catalog.marketplace.offer.pick') }
                    </Button> }
                { type === PUBLIC_OFFER &&
                    <>
                        <Button variant="secondary" size="sm" onClick={ () => onClick(offerData) }>
                            { LocalizeText('buy') }
                        </Button>
                        <Button variant="secondary" size="sm" disabled>
                            { LocalizeText('catalog.marketplace.view_more') }
                        </Button>
                    </> }
            </Column>
        </LayoutGridItem>
    );
}
