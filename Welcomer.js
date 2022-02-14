
const welcome_channel = "Welcome Channel ID";
const welcome_Message = "Hi";
/*
options:
[NAME] => The Member Username!
[AGE] => The Member Time Created At!
[COUNT] => The Members Count In The Server!
[GNAME] => The Server Name!
[INVITER] => The Member Inviter!
[DEFALT] => The Defalt Welcome Message!
*/
const welcome_img  =" Welcome img URL";

const { MessageAttachment } = require('discord.js');
const serverInvites = new Map();
const Canvas = require('canvas');

client.on("inviteCreate", async invite => serverInvites.set(invite.guild.id, await invite.guild.fetchInvites())).on("ready", () => {
    client.guilds.cache.forEach(guild => {
      guild.fetchInvites().then(invites => serverInvites.set(guild.id, invites)).catch(err => console.log(err));
    });
  }).on('guildMemberAdd', async (member) => {
    const checkedInvites = serverInvites.get(member.guild.id);
    const checkInvites = await member.guild.fetchInvites();
    serverInvites.set(member.guild.id, checkInvites);
    const channel = member.guild.channels.cache.get(welcome_channel)
    const canvas = Canvas.createCanvas(519, 292);
    const ctx = canvas.getContext('2d');
  
    const img = await Canvas.loadImage(welcome_img);
    let x = 0
    let y = 0
    ctx.drawImage(img, x, y)
  
    Canvas.registerFont('CairoBold.ttf', { family: 'cairo-bold' });
  
    var name = member.user.tag;
    ctx.strokeStyle = '#ed9209';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Cairo';
    ctx.fillStyle = '#ed9209';
  
    ctx.fillText(name, canvas.width / 2.4, canvas.height / 2.7);
  
    var join = member.user.createdAt.toLocaleString();
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Cairo';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(join, canvas.width / 2.4, canvas.height / 2.0);
  
  
  
    x = 40
    y = 80
  
    ctx.beginPath();
    ctx.arc(105, 145, 65, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
  
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png" }))
    ctx.lineTo(avatar, 250, 150)
    ctx.drawImage(avatar, x, y);
  
    const attachment = new MessageAttachment(canvas.toBuffer(), "welcome.png")
    channel.send('', attachment).then(m => {
      setTimeout(() => {
        const usedInvite = checkInvites.find(inv => checkedInvites.get(inv.code).uses < inv.uses);
        channel.send(`${welcome_Message.replace('[NAME]', `<@!${member.user.id}>`).replace('[COUNT]', member.guild.memberCount).replace('[AGE]', member.user.createdAt.toLocaleString()).replace('[GNAME]', member.guild.name).replace('[INVITER]', usedInvite.inviter.username).replace('[NAME]', `<@!${member.user.id}>`).replace('[DEFALT]', `> \`-\` **<@!${member.user.id}> Was Joined To ${member.guild.name} Server! 💫**\n> \`-\` **<@!${member.user.id}> Account Created At ${member.user.createdAt.toLocaleString()} 🕓**\n> \`-\` **${member.guild.name} Now Has ${member.guild.memberCount} Member! 👥**\n> \`-\` **<@!${member.user.id}> Was Invited By ${usedInvite.inviter.username}! 🧲**`) || `> \`-\` **<@!${member.user.id}> Was Joined To ${member.guild.name} Server! 💫**\n> \`-\` **<@!${member.user.id}> Account Created At ${member.user.createdAt.toLocaleString()} 🕓**\n> \`-\` **__${member.guild.name} Server__ Now Has ${member.guild.memberCount} Member! 👥**\n> \`-\` **<@!${member.user.id}> Was Invited By ${usedInvite.inviter.username}! 🧲**`}`)
      }, 1500)
    })
  }) 