package com.eu.habbo.messages.incoming.events.calendar;

import com.eu.habbo.Emulator;
import com.eu.habbo.messages.incoming.MessageHandler;

public class AdventCalendarForceOpenEvent extends MessageHandler {
    @Override
    public void handle() throws Exception {
        String campaign = this.packet.readString();
        int day = this.packet.readInt();

        Emulator.getGameEnvironment().getCatalogManager().claimCalendarReward(this.client.getHabbo(), day, true);
    }
}