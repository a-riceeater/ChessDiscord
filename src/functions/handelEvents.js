export default (client) => {
    client.handleEvents = async (eventFiles, path) => {
      for (const file of eventFiles) {
        const { default: event } = await import(`../events/${file}`);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      }
    };
  };
  