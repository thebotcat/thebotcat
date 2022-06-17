// searches a collection with a query

function searchRoles(roles, query) {
  if (typeof query != 'string') query = '';
  
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionRole = roles.cache.get(query);
  if (mentionRole) return mentionRole;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var roleArr = Array.from(roles.cache.values());
  
  // step 1: check if there is only one possibility anyway
  if (roleArr.length == 1) return roleArr[0];
  
  // step 2: run through the array checking every element for various things
  var roleLowerIncludes = [], roleLowerEqual = [], roleIncludes = [], roleEqual = [], roleIds = [];
  for (var role of roleArr) {
    if (role.name.toLowerCase() == queryLower) { roleLowerIncludes.push(role); roleLowerEqual.push(role); }
    else if (role.name.toLowerCase().includes(queryLower)) roleLowerIncludes.push(role);
    if (role.name == query) { roleIncludes.push(role); roleEqual.push(role); }
    else if (role.name.includes(query)) roleIncludes.push(role);
    if (role.id.includes(queryNumbers)) roleIds.push(role);
  }
  
  // step 3: all the checking for array of size 1 lol
  if (roleLowerEqual.length == 1) return roleLowerEqual[0];
  if (roleLowerIncludes.length == 1) return roleLowerIncludes[0];
  if (roleEqual.length == 1) return roleEqual[0];
  if (roleIncludes.length == 1) return roleIncludes[0];
  if (roleIds.length == 1) return roleIds[0];
  
  var arrays = [roleLowerEqual, roleLowerIncludes, roleEqual, roleIncludes, roleIds];
  
  var minSize = Infinity, minArr = null;
  for (var array of arrays) {
    if (array.length < minSize && array.length != 0) {
      minArr = array;
      minSize = minArr.length;
    }
  }
    
  return minArr ? minArr : [];
}

async function searchMembers(members, query) {
  if (typeof query != 'string') query = '';
  
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionMember = members.cache.get(query);
  if (mentionMember) return mentionMember;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var memArr = Array.from(members.cache.values());
  
  // step 1: check if there is only one possibility anyway
  if (memArr.length == 1) return memArr[0];
  
  // step 2: run through the array checking every element for various things
  var memUserLowerIncludes = [], memUserLowerEqual = [], memUserIncludes = [], memUserEqual = [],
    memNickLowerIncludes = [], memNickLowerEqual = [], memNickIncludes = [], memNickEqual = [],
    memIds = [];
  for (var mem of memArr) {
    if (mem.user.username.toLowerCase() == queryLower) { memUserLowerIncludes.push(mem); memUserLowerEqual.push(mem); }
    else if (mem.user.tag.toLowerCase().includes(queryLower)) memUserLowerIncludes.push(mem);
    if (mem.user.username == query) { memUserIncludes.push(mem); memUserEqual.push(mem); }
    else if (mem.user.tag.includes(query)) memUserIncludes.push(mem);
    if (mem.nickname) {
      if (mem.nickname.toLowerCase() == queryLower) { memNickLowerIncludes.push(mem); memNickLowerEqual.push(mem); }
      else if (mem.nickname.toLowerCase().includes(queryLower)) memNickLowerIncludes.push(mem);
      if (mem.nickname == query) { memNickIncludes.push(mem); memNickEqual.push(mem); }
      else if (mem.nickname.includes(query)) memNickIncludes.push(mem);
    }
    if (mem.id.includes(queryNumbers)) memIds.push(mem);
  }
  
  // step 3: all the checking for array of size 1 lol
  if (memUserLowerEqual.length == 1) return memUserLowerEqual[0];
  if (memUserLowerIncludes.length == 1) return memUserLowerIncludes[0];
  if (memUserEqual.length == 1) return memUserEqual[0];
  if (memUserIncludes.length == 1) return memUserIncludes[0];
  if (memNickLowerEqual.length == 1) return memNickLowerEqual[0];
  if (memNickLowerIncludes.length == 1) return memNickLowerIncludes[0];
  if (memNickEqual.length == 1) return memNickEqual[0];
  if (memNickIncludes.length == 1) return memNickIncludes[0];
  if (memIds.length == 1) return memIds[0];
  
  var arrays = [memUserLowerEqual, memUserLowerIncludes, memUserEqual, memUserIncludes, memNickLowerEqual, memNickLowerIncludes, memNickEqual, memNickIncludes, memIds];
  
  var minSize = Infinity, minArr = null;
  for (var array of arrays) {
    if (array.length < minSize && array.length != 0) {
      minArr = array;
      minSize = minArr.length;
    }
  }
  
  if (/[0-9]+/.test(query)) {
    try {
      return await members.fetch(query);
    } catch (e) {}
  }
  
  return minArr ? minArr : null;
}

async function searchUsers(users, query, options) {
  if (typeof query != 'string') query = '';
  
  // convert mentions to the inside
  if (/^ *<(?:@!?|@&|#)([0-9]+)> *$/.test(query)) query = /^ *<(?:@!?|@&|#)([0-9]+)> *$/.exec(query)[1];
  
  // if mention / id by itself is valid, return it immediately
  var mentionUser = users.cache.get(query);
  if (mentionUser) return mentionUser;
  
  var queryLower = query.toLowerCase(), queryNumbers = query.replace(/[^0-9]+/g, '');
  var userArr = Array.from(users.cache.values()), minArr = null;
  
  // all these will not be run for non debug circumstances
  if (typeof options == 'object' && options.safeMode != null && !options.safeMode) {
    // step 1: check if there is only one possibility anyway
    if (userArr.length == 1) return userArr[0];
    
    // step 2: run through the array checking every element for various things
    var userLowerIncludes = [], userLowerEqual = [], userIncludes = [], userEqual = [], userIds = [];
    for (var user of userArr) {
      if (user.username.toLowerCase() == queryLower) { userLowerIncludes.push(user); userLowerEqual.push(user); }
      else if (user.tag.toLowerCase().includes(queryLower)) userLowerIncludes.push(user);
      if (user.username == query) { userIncludes.push(user); userEqual.push(user); }
      else if (user.tag.includes(query)) userIncludes.push(user);
      if (user.id.includes(queryNumbers)) userIds.push(user);
    }
    
    // step 3: all the checking for array of size 1 lol
    if (userLowerEqual.length == 1) return userLowerEqual[0];
    if (userLowerIncludes.length == 1) return userLowerIncludes[0];
    if (userEqual.length == 1) return userEqual[0];
    if (userIncludes.length == 1) return userIncludes[0];
    if (userIds.length == 1) return userIds[0];
    
    var arrays = [userLowerEqual, userLowerIncludes, userEqual, userIncludes, userIds];
    
    var minSize = Infinity;
    for (var array of arrays) {
      if (array.length < minSize && array.length != 0) {
        minArr = array;
        minSize = minArr.length;
      }
    }
  }
  
  if (/[0-9]+/.test(query)) {
    try {
      return await users.fetch(query);
    } catch (e) {}
  }
  
  return minArr ? minArr.map(x => users.cache.get(x)) : null;
}

function searchRole(roles, query) {
  let role = searchRoles(roles, query);
  if (Array.isArray(role)) return null;
  return role;
}

async function searchMember(members, query) {
  let member = await searchMembers(members, query);
  if (Array.isArray(member)) return null;
  return member;
}

async function searchUser(query, options) {
  let user = await searchUsers(client.users, query, options);
  if (Array.isArray(user)) return null;
  return user;
}

module.exports = {
  searchRoles, searchMembers, searchUsers,
  searchRole, searchMember, searchUser,
};
