package com.eu.habbo.threading.runnables;

import com.eu.habbo.habbohotel.guides.GuardianTicket;

public class GuardianVotingFinish implements Runnable {
    private final GuardianTicket ticket;
    private int checkSum;

    public GuardianVotingFinish(GuardianTicket ticket) {
        this.ticket = ticket;
        this.checkSum = this.ticket.getCheckSum();
    }

    @Override
    public void run() {
        if (this.ticket.inProgress()) {
            if (this.ticket.getCheckSum() == this.checkSum) {
                this.ticket.finish();
            }
        }
    }
}
