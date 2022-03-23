import { GetCfhStatusMessageComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback } from 'react';
import { LocalizeText, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { GuideToolEvent } from '../../../events';
import { DispatchUiEvent } from '../../../hooks';
import { useHelpContext } from '../HelpContext';

export const HelpIndexView: FC<{}> = props =>
{
    const { helpReportState = null, setHelpReportState = null } = useHelpContext();
    
    const onReportClick = useCallback(() =>
    {
        const reportState = Object.assign({}, helpReportState );
        reportState.currentStep = 1;
        setHelpReportState(reportState);
    },[helpReportState, setHelpReportState]);

    const onRequestMySanctionStatusClick = useCallback(() =>
    {
        SendMessageComposer(new GetCfhStatusMessageComposer(false));
    }, []);

    const onNewHelpRequestClick = useCallback(() =>
    {
        DispatchUiEvent(new GuideToolEvent(GuideToolEvent.CREATE_HELP_REQUEST));
    }, []);

    return (
        <>
            <Column gap={ 1 }>
                <Text fontSize={ 3 }>{ LocalizeText('help.main.frame.title') }</Text>
                <Text>{ LocalizeText('help.main.self.description') }</Text>
            </Column>
            <Column gap={ 1 }>
                <Button onClick={ onReportClick }>{ LocalizeText('help.main.bully.subtitle') }</Button>
                <Button onClick={ onNewHelpRequestClick }>{ LocalizeText('help.main.help.title') }</Button>
                <Button disabled={ true }>{ LocalizeText('help.main.self.tips.title') }</Button>
                <Button variant="link" className="text-black" onClick={ onRequestMySanctionStatusClick }>{ LocalizeText('help.main.my.sanction.status') }</Button>
            </Column>
        </>
    )
}
