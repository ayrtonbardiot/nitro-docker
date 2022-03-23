package com.eu.habbo.messages.incoming.guilds;

import com.eu.habbo.Emulator;
import com.eu.habbo.habbohotel.guilds.Guild;
import com.eu.habbo.habbohotel.permissions.Permission;
import com.eu.habbo.habbohotel.rooms.Room;
import com.eu.habbo.messages.incoming.MessageHandler;
import com.eu.habbo.plugin.events.guilds.GuildChangedNameEvent;

public class GuildChangeNameDescEvent extends MessageHandler {
    @Override
    public void handle() throws Exception {
        int guildId = this.packet.readInt();

        Guild guild = Emulator.getGameEnvironment().getGuildManager().getGuild(guildId);

        if (guild != null) {
            if (guild.getOwnerId() == this.client.getHabbo().getHabboInfo().getId() || this.client.getHabbo().hasPermission(Permission.ACC_GUILD_ADMIN)) {
                GuildChangedNameEvent nameEvent = new GuildChangedNameEvent(guild, this.packet.readString(), this.packet.readString());
                Emulator.getPluginManager().fireEvent(nameEvent);

                if (nameEvent.isCancelled())
                    return;

                if (guild.getName().equals(nameEvent.name) && guild.getDescription().equals(nameEvent.description))
                    return;

                if(nameEvent.name.length() > 29 || nameEvent.description.length() > 254)
                    return;

                guild.setName(nameEvent.name);
                guild.setDescription(nameEvent.description);
                guild.needsUpdate = true;
                guild.run();

                Room room = Emulator.getGameEnvironment().getRoomManager().getRoom(guild.getRoomId());

                if (room != null && !room.getCurrentHabbos().isEmpty()) {
                    room.refreshGuild(guild);
                }
            }
        }
    }
}
