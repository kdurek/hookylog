import { env } from "@/env";

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  timestamp?: string;
  footer?: {
    text: string;
    icon_url?: string;
  };
}

interface DiscordMessage {
  content?: string;
  username?: string;
  avatar_url?: string;
  embeds?: DiscordEmbed[];
}

export function createDiscordMessage() {
  const message: DiscordMessage = {};
  let currentEmbed: DiscordEmbed = { fields: [] };
  const embeds: DiscordEmbed[] = [];

  const builder = {
    setContent: (content: string) => {
      message.content = content;
      return builder;
    },

    setUsername: (username: string) => {
      message.username = username;
      return builder;
    },

    setAvatar: (url: string) => {
      message.avatar_url = url;
      return builder;
    },

    addEmbed: () => {
      if (Object.keys(currentEmbed).length > 1) {
        embeds.push(currentEmbed);
      }
      currentEmbed = { fields: [] };
      return builder;
    },

    setTitle: (title: string) => {
      currentEmbed.title = title;
      return builder;
    },

    setDescription: (description: string) => {
      currentEmbed.description = description;
      return builder;
    },

    setColor: (color: number) => {
      currentEmbed.color = color;
      return builder;
    },

    addField: (name: string, value: string, inline = false) => {
      currentEmbed.fields?.push({ name, value, inline });
      return builder;
    },

    setTimestamp: () => {
      currentEmbed.timestamp = new Date().toISOString();
      return builder;
    },

    setFooter: (text: string, iconUrl?: string) => {
      currentEmbed.footer = { text, icon_url: iconUrl };
      return builder;
    },

    build: () => {
      builder.addEmbed();
      if (embeds.length > 0) {
        message.embeds = embeds;
      }
      return message;
    },
  };

  return builder;
}

export async function sendDiscordNotification(
  builder: ReturnType<typeof createDiscordMessage>,
) {
  if (!env.DISCORD_WEBHOOK_URL) {
    console.warn("Discord webhook URL not configured");
    return;
  }

  try {
    const message = builder.build();
    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Discord notification failed: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Failed to send Discord notification:", error);
    throw error;
  }
}
