const express = require("express");
const app = express.Router();

const Friends = require("../model/friends");
const Profile = require("../model/profiles.js");
const profileManager = require("../structs/profile.js");
const error = require("../structs/error.js");
const functions = require("../structs/functions.js");

const { verifyToken, verifyClient } = require("../tokenManager/tokenVerify.js");

global.giftReceived = {};

// Set support a creator code
express.post("/fortnite/api/game/v2/profile/*/client/SetAffiliateName", async (req, res) => {
    const profile = require("./../profiles/common_core.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    const SupportedCodes = require("./../responses/SAC.json");
    SupportedCodes.forEach(code => {
        if (req.body.affiliateName.toLowerCase() == code.toLowerCase() || req.body.affiliateName == "") {
            profile.stats.attributes.mtx_affiliate_set_time = new Date().toISOString();
            profile.stats.attributes.mtx_affiliate = req.body.affiliateName;
            
            StatChanged = true;
        }
    })

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "mtx_affiliate_set_time",
            "value": profile.stats.attributes.mtx_affiliate_set_time
        })

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "mtx_affiliate",
            "value": profile.stats.attributes.mtx_affiliate
        })

        fs.writeFileSync("./profiles/common_core.json", JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": "common_core",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Set STW banner
express.post("/fortnite/api/game/v2/profile/*/client/SetHomebaseBanner", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.homebaseBannerIconId && req.body.homebaseBannerColorId) {
        switch (req.query.profileId) {

            case "profile0":
                profile.stats.attributes.homebase.bannerIconId = req.body.homebaseBannerIconId;
                profile.stats.attributes.homebase.bannerColorId = req.body.homebaseBannerColorId;
                StatChanged = true;
                break;

            case "common_public":
                profile.stats.attributes.banner_icon = req.body.homebaseBannerIconId;
                profile.stats.attributes.banner_color = req.body.homebaseBannerColorId;
                StatChanged = true;
                break;

        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        if (req.query.profileId == "profile0") {
            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "homebase",
                "value": profile.stats.attributes.homebase
            })
        }

        if (req.query.profileId == "common_public") {
            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "banner_icon",
                "value": profile.stats.attributes.banner_icon
            })

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "banner_color",
                "value": profile.stats.attributes.banner_color
            })
        }

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Set Homebase Name STW
express.post("/fortnite/api/game/v2/profile/*/client/SetHomebaseName", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.homebaseName) {
        switch (req.query.profileId) {

            case "profile0":
                profile.stats.attributes.homebase.townName = req.body.homebaseName;
                StatChanged = true;
                break;

            case "common_public":
                profile.stats.attributes.homebase_name = req.body.homebaseName;
                StatChanged = true;
                break;

        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        if (req.query.profileId == "profile0") {
            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "homebase",
                "value": profile.stats.attributes.homebase
            })
        }

        if (req.query.profileId == "common_public") {
            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "homebase_name",
                "value": profile.stats.attributes.homebase_name
            })
        }

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Buy skill tree perk STW
express.post("/fortnite/api/game/v2/profile/*/client/PurchaseHomebaseNode", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    const ID = functions.MakeID();

    if (req.body.nodeId) {
        profile.items[ID] = {
            "templateId": `HomebaseNode:${req.body.nodeId}`,
            "attributes": {
                "item_seen": true
            },
            "quantity": 1
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Open Winterfest presents (11.31, 19.01 & 23.10)
express.post("/fortnite/api/game/v2/profile/*/client/UnlockRewardNode", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);
    const common_core = require("./../profiles/common_core.json");
    const WinterFestIDS = require("./../responses/Athena/winterfestRewards.json");
    const memory = functions.GetVersionInfo(req);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    var CommonCoreChanged = false;
    var ItemExists = false;
    var Season = "Season" + memory.season;

    const GiftID = functions.MakeID();
    profile.items[GiftID] = {"templateId":"GiftBox:gb_winterfestreward","attributes":{"max_level_bonus":0,"fromAccountId":"","lootList":[],"level":1,"item_seen":false,"xp":0,"giftedOn":new Date().toISOString(),"params":{"SubGame":"Athena","winterfestGift":"true"},"favorite":false},"quantity":1};

    if (req.body.nodeId && req.body.rewardGraphId) {
        for (var i = 0; i < WinterFestIDS[Season][req.body.nodeId].length; i++) {
            var ID = functions.MakeID();
            Reward = WinterFestIDS[Season][req.body.nodeId][i]

            if (Reward.toLowerCase().startsWith("homebasebannericon:")) {
                if (CommonCoreChanged == false) {
                    MultiUpdate.push({
                        "profileRevision": common_core.rvn || 0,
                        "profileId": "common_core",
                        "profileChangesBaseRevision": common_core.rvn || 0,
                        "profileChanges": [],
                        "profileCommandRevision": common_core.commandRevision || 0,
                    })

                    CommonCoreChanged = true;
                }

                for (var key in common_core.items) {
                    if (common_core.items[key].templateId.toLowerCase() == Reward.toLowerCase()) {
                        common_core.items[key].attributes.item_seen = false;
                        ID = key;
                        ItemExists = true;

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": key,
                            "attributeName": "item_seen",
                            "attributeValue": common_core.items[key].attributes.item_seen
                        })
                    }
                }

                if (ItemExists == false) {
                    common_core.items[ID] = {
                        "templateId": Reward,
                        "attributes": {
                            "max_level_bonus": 0,
                            "level": 1,
                            "item_seen": false,
                            "xp": 0,
                            "variants": [],
                            "favorite": false
                        },
                        "quantity": 1
                    };
        
                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": common_core.items[ID]
                    })
                }

                ItemExists = false;

                common_core.rvn += 1;
                common_core.commandRevision += 1;
        
                MultiUpdate[0].profileRevision = common_core.rvn || 0;
                MultiUpdate[0].profileCommandRevision = common_core.commandRevision || 0;

                profile.items[GiftID].attributes.lootList.push({"itemType":Reward,"itemGuid":ID,"itemProfile":"common_core","attributes":{"creation_time":new Date().toISOString()},"quantity":1})
            }

            if (!Reward.toLowerCase().startsWith("homebasebannericon:")) {
                for (var key in profile.items) {
                    if (profile.items[key].templateId.toLowerCase() == Reward.toLowerCase()) {
                        profile.items[key].attributes.item_seen = false;
                        ID = key;
                        ItemExists = true;

                        ApplyProfileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": key,
                            "attributeName": "item_seen",
                            "attributeValue": profile.items[key].attributes.item_seen
                        })
                    }
                }

                if (ItemExists == false) {
                    profile.items[ID] = {
                        "templateId": Reward,
                        "attributes": {
                            "max_level_bonus": 0,
                            "level": 1,
                            "item_seen": false,
                            "xp": 0,
                            "variants": [],
                            "favorite": false
                        },
                        "quantity": 1
                    };
        
                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": profile.items[ID]
                    })
                }

                ItemExists = false;

                profile.items[GiftID].attributes.lootList.push({"itemType":Reward,"itemGuid":ID,"itemProfile":"athena","attributes":{"creation_time":new Date().toISOString()},"quantity":1})
            }
        }
        profile.items[req.body.rewardGraphId].attributes.reward_keys[0].unlock_keys_used += 1;
        profile.items[req.body.rewardGraphId].attributes.reward_nodes_claimed.push(req.body.nodeId);

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": GiftID,
            "item": profile.items[GiftID]
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.rewardGraphId,
            "attributeName": "reward_keys",
            "attributeValue": profile.items[req.body.rewardGraphId].attributes.reward_keys
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.rewardGraphId,
            "attributeName": "reward_nodes_claimed",
            "attributeValue": profile.items[req.body.rewardGraphId].attributes.reward_nodes_claimed
        })

        if (memory.season == 11) {
            profile.items.S11_GIFT_KEY.quantity -= 1;

            ApplyProfileChanges.push({
                "changeType": "itemQuantityChanged",
                "itemId": "S11_GIFT_KEY",
                "quantity": profile.items.S11_GIFT_KEY.quantity
            })
        }

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
        if (CommonCoreChanged == true) {
            fs.writeFileSync("./profiles/common_core.json", JSON.stringify(common_core, null, 2));
        }
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Remove gift box
express.post("/fortnite/api/game/v2/profile/*/client/RemoveGiftBox", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    // Gift box ID on 11.31
    if (req.body.giftBoxItemId) {
        var id = req.body.giftBoxItemId;

        delete profile.items[id];

        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": id
        })

        StatChanged = true;
    }

    // Gift box ID on 19.01
    if (req.body.giftBoxItemIds) {
        for (var i in req.body.giftBoxItemIds) {
            var id = req.body.giftBoxItemIds[i];

            delete profile.items[id];

            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": id
            })
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Set party assist quest
express.post("/fortnite/api/game/v2/profile/*/client/SetPartyAssistQuest", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (profile.stats.attributes.hasOwnProperty("party_assist_quest")) {
        profile.stats.attributes.party_assist_quest = req.body.questToPinAsPartyAssist || "";
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "party_assist_quest",
            "value": profile.stats.attributes.party_assist_quest
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Set pinned BR quest
express.post("/fortnite/api/game/v2/profile/*/client/AthenaPinQuest", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (profile.stats.attributes.hasOwnProperty("pinned_quest")) {
        profile.stats.attributes.pinned_quest = req.body.pinnedQuest || "";
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "pinned_quest",
            "value": profile.stats.attributes.pinned_quest
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Set pinned STW quests
express.post("/fortnite/api/game/v2/profile/*/client/SetPinnedQuests", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.pinnedQuestIds) {
        profile.stats.attributes.client_settings.pinnedQuestInstances = req.body.pinnedQuestIds;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "client_settings",
            "value": profile.stats.attributes.client_settings
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Replace Daily Quests
express.post("/fortnite/api/game/v2/profile/*/client/FortRerollDailyQuest", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var DailyQuestPath = req.query.profileId == "profile0" || req.query.profileId == "campaign" ? "./../responses/Campaign/quests.json" : "./../responses/Athena/quests.json";
    var DailyQuestIDS = JSON.parse(JSON.stringify(require(DailyQuestPath))).Daily;

    const NewQuestID = functions.MakeID();
    var randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

    for (var key in profile.items) {
        while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
            randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
        }
    }

    if (req.body.questId && profile.stats.attributes.quest_manager.dailyQuestRerolls >= 1) {
        profile.stats.attributes.quest_manager.dailyQuestRerolls -= 1;

        delete profile.items[req.body.questId];

        profile.items[NewQuestID] = {
            "templateId": DailyQuestIDS[randomNumber].templateId,
            "attributes": {
                "creation_time": new Date().toISOString(),
                "level": -1,
                "item_seen": false,
                "sent_new_notification": false,
                "xp_reward_scalar": 1,
                "quest_state": "Active",
                "last_state_change_time": new Date().toISOString(),
                "max_level_bonus": 0,
                "xp": 0,
                "favorite": false
            },
            "quantity": 1
        };

        for (var i in DailyQuestIDS[randomNumber].objectives) {
            profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "quest_manager",
            "value": profile.stats.attributes.quest_manager
        })

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": NewQuestID,
            "item": profile.items[NewQuestID]
        })

        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.questId
        })

        Notifications.push({
            "type": "dailyQuestReroll",
            "primary": true,
            "newQuestId": DailyQuestIDS[randomNumber].templateId
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Mark New Quest Notification Sent
express.post("/fortnite/api/game/v2/profile/*/client/MarkNewQuestNotificationSent", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.itemIds) {
        for (var i in req.body.itemIds) {
            var id = req.body.itemIds[i];

            profile.items[id].attributes.sent_new_notification = true

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": id,
                "attributeName": "sent_new_notification",
                "attributeValue": true
            })
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Check for new quests
express.post("/fortnite/api/game/v2/profile/*/client/ClientQuestLogin", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);
    var AthenaQuestIDS = JSON.parse(JSON.stringify(require("./../responses/Athena/quests.json")));
    var CampaignQuestIDS = JSON.parse(JSON.stringify(require("./../responses/Campaign/quests.json")));
    const memory = functions.GetVersionInfo(req);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var QuestCount = 0;
    var ShouldGiveQuest = true;
    var DateFormat = (new Date().toISOString()).split("T")[0];
    var DailyQuestIDS;
    var SeasonQuestIDS;

    const SeasonPrefix = memory.season < 10 ? `0${memory.season}` : memory.season;

    try {
        if (req.query.profileId == "profile0" || req.query.profileId == "campaign") {
            DailyQuestIDS = CampaignQuestIDS.Daily

            if (CampaignQuestIDS.hasOwnProperty(`Season${SeasonPrefix}`)) {
                SeasonQuestIDS = CampaignQuestIDS[`Season${SeasonPrefix}`]
            }

            for (var key in profile.items) {
                if (profile.items[key].templateId.toLowerCase().startsWith("quest:daily")) {
                    QuestCount += 1;
                }
            }

            // Grant completed founder's pack quests.
            if (config.Profile.bGrantFoundersPacks == true) {
                var QuestsToGrant = [
                    "Quest:foundersquest_getrewards_0_1",
                    "Quest:foundersquest_getrewards_1_2",
                    "Quest:foundersquest_getrewards_2_3",
                    "Quest:foundersquest_getrewards_3_4",
                    "Quest:foundersquest_chooseherobundle",
                    "Quest:foundersquest_getrewards_4_5",
                    "Quest:foundersquest_herobundle_nochoice"
                ]

                for (var i in QuestsToGrant) {
                    var bSkipThisQuest = false;
                    for (var key in profile.items) {
                        if (profile.items[key].templateId.toLowerCase() == QuestsToGrant[i].toLowerCase()) {
                            bSkipThisQuest = true;
                        }
                    }
                    if (bSkipThisQuest == true) {
                        continue;
                    }

                    var ItemID = functions.MakeID();
                    var Item = {
                        "templateId": QuestsToGrant[i],
                        "attributes": {
                            "creation_time": "min",
                            "quest_state": "Completed",
                            "last_state_change_time": new Date().toISOString(),
                            "level": -1,
                            "sent_new_notification": true,
                            "xp_reward_scalar": 1
                        },
                        "quantity": 1
                    }
                    profile.items[ItemID] = Item
                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ItemID,
                        "item": Item
                    })
                    StatChanged = true;
                }
            }
        }

        if (req.query.profileId == "athena") {
            DailyQuestIDS = AthenaQuestIDS.Daily

            if (AthenaQuestIDS.hasOwnProperty(`Season${SeasonPrefix}`)) {
                SeasonQuestIDS = AthenaQuestIDS[`Season${SeasonPrefix}`]
            }

            for (var key in profile.items) {
                if (profile.items[key].templateId.toLowerCase().startsWith("quest:athenadaily")) {
                    QuestCount += 1;
                }
            }
        }

        if (profile.stats.attributes.hasOwnProperty("quest_manager")) {
            if (profile.stats.attributes.quest_manager.hasOwnProperty("dailyLoginInterval")) {
                if (profile.stats.attributes.quest_manager.dailyLoginInterval.includes("T")) {
                    var DailyLoginDate = (profile.stats.attributes.quest_manager.dailyLoginInterval).split("T")[0];

                    if (DailyLoginDate == DateFormat) {
                        ShouldGiveQuest = false;
                    } else {
                        ShouldGiveQuest = true;
                        if (profile.stats.attributes.quest_manager.dailyQuestRerolls <= 0) {
                            profile.stats.attributes.quest_manager.dailyQuestRerolls += 1;
                        }
                    }
                }
            }
        }

        if (QuestCount < 3 && ShouldGiveQuest == true) {
            const NewQuestID = functions.MakeID();
            var randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);

            for (var key in profile.items) {
                while (DailyQuestIDS[randomNumber].templateId.toLowerCase() == profile.items[key].templateId.toLowerCase()) {
                    randomNumber = Math.floor(Math.random() * DailyQuestIDS.length);
                }
            }

            profile.items[NewQuestID] = {
                "templateId": DailyQuestIDS[randomNumber].templateId,
                "attributes": {
                    "creation_time": new Date().toISOString(),
                    "level": -1,
                    "item_seen": false,
                    "sent_new_notification": false,
                    "xp_reward_scalar": 1,
                    "quest_state": "Active",
                    "last_state_change_time": new Date().toISOString(),
                    "max_level_bonus": 0,
                    "xp": 0,
                    "favorite": false
                },
                "quantity": 1
            };

            for (var i in DailyQuestIDS[randomNumber].objectives) {
                profile.items[NewQuestID].attributes[`completion_${DailyQuestIDS[randomNumber].objectives[i].toLowerCase()}`] = 0
            }

            profile.stats.attributes.quest_manager.dailyLoginInterval = new Date().toISOString();

            ApplyProfileChanges.push({
                "changeType": "itemAdded",
                "itemId": NewQuestID,
                "item": profile.items[NewQuestID]
            })

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": "quest_manager",
                "value": profile.stats.attributes.quest_manager
            })

            StatChanged = true;
        }
    } catch (err) {}

    for (var key in profile.items) {
        if (key.startsWith("QS") && Number.isInteger(Number(key[2])) && Number.isInteger(Number(key[3])) && key[4] === "-") {
            if (!key.startsWith(`QS${SeasonPrefix}-`)) {
                delete profile.items[key];

                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": key
                })

                StatChanged = true;
            }
        }
    }

    if (SeasonQuestIDS) {
        var QuestsToAdd = [];
        
        if (req.query.profileId == "athena") {
            for (var ChallengeBundleScheduleID in SeasonQuestIDS.ChallengeBundleSchedules) {
                if (profile.items.hasOwnProperty(ChallengeBundleScheduleID)) {
                    ApplyProfileChanges.push({
                        "changeType": "itemRemoved",
                        "itemId": ChallengeBundleScheduleID
                    })
                }

                var ChallengeBundleSchedule = SeasonQuestIDS.ChallengeBundleSchedules[ChallengeBundleScheduleID];

                profile.items[ChallengeBundleScheduleID] = {
                    "templateId": ChallengeBundleSchedule.templateId,
                    "attributes": {
                        "unlock_epoch": new Date().toISOString(),
                        "max_level_bonus": 0,
                        "level": 1,
                        "item_seen": true,
                        "xp": 0,
                        "favorite": false,
                        "granted_bundles": ChallengeBundleSchedule.granted_bundles
                    },
                    "quantity": 1
                }

                ApplyProfileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": ChallengeBundleScheduleID,
                    "item": profile.items[ChallengeBundleScheduleID]
                })

                StatChanged = true;
            }

            for (var ChallengeBundleID in SeasonQuestIDS.ChallengeBundles) {
                if (profile.items.hasOwnProperty(ChallengeBundleID)) {
                    ApplyProfileChanges.push({
                        "changeType": "itemRemoved",
                        "itemId": ChallengeBundleID
                    })
                }

                var ChallengeBundle = SeasonQuestIDS.ChallengeBundles[ChallengeBundleID];

                if (config.Profile.bCompletedSeasonalQuests == true && ChallengeBundle.hasOwnProperty("questStages")) {
                    ChallengeBundle.grantedquestinstanceids = ChallengeBundle.grantedquestinstanceids.concat(ChallengeBundle.questStages);
                }

                profile.items[ChallengeBundleID] = {
                    "templateId": ChallengeBundle.templateId,
                    "attributes": {
                        "has_unlock_by_completion": false,
                        "num_quests_completed": 0,
                        "level": 0,
                        "grantedquestinstanceids": ChallengeBundle.grantedquestinstanceids,
                        "item_seen": true,
                        "max_allowed_bundle_level": 0,
                        "num_granted_bundle_quests": 0,
                        "max_level_bonus": 0,
                        "challenge_bundle_schedule_id": ChallengeBundle.challenge_bundle_schedule_id,
                        "num_progress_quests_completed": 0,
                        "xp": 0,
                        "favorite": false
                    },
                    "quantity": 1
                }

                QuestsToAdd = QuestsToAdd.concat(ChallengeBundle.grantedquestinstanceids);
                profile.items[ChallengeBundleID].attributes.num_granted_bundle_quests = ChallengeBundle.grantedquestinstanceids.length;

                if (config.Profile.bCompletedSeasonalQuests == true) {
                    profile.items[ChallengeBundleID].attributes.num_quests_completed = ChallengeBundle.grantedquestinstanceids.length;
                    profile.items[ChallengeBundleID].attributes.num_progress_quests_completed = ChallengeBundle.grantedquestinstanceids.length;

                    if ((memory.season == 10 || memory.season == 11) && (ChallengeBundle.templateId.toLowerCase().includes("missionbundle_s10_0") || ChallengeBundle.templateId.toLowerCase() == "challengebundle:missionbundle_s11_stretchgoals2")) {
                        profile.items[ChallengeBundleID].attributes.level += 1;
                    }
                }

                ApplyProfileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": ChallengeBundleID,
                    "item": profile.items[ChallengeBundleID]
                })

                StatChanged = true;
            }
        } else { // For STW just get all the Quests available due to no ChallengeBundles
            for (var key in SeasonQuestIDS.Quests) {
                QuestsToAdd.push(key)
            }
        }

        function ParseQuest(QuestID) {
            var Quest = SeasonQuestIDS.Quests[QuestID];

            if (profile.items.hasOwnProperty(QuestID)) {
                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": QuestID
                })
            }

            profile.items[QuestID] = {
                "templateId": Quest.templateId,
                "attributes": {
                    "creation_time": new Date().toISOString(),
                    "level": -1,
                    "item_seen": true,
                    "sent_new_notification": true,
                    "challenge_bundle_id": Quest.challenge_bundle_id || "",
                    "xp_reward_scalar": 1,
                    "quest_state": "Active",
                    "last_state_change_time": new Date().toISOString(),
                    "max_level_bonus": 0,
                    "xp": 0,
                    "favorite": false
                },
                "quantity": 1
            }

            if (config.Profile.bCompletedSeasonalQuests == true) {
                profile.items[QuestID].attributes.quest_state = "Claimed";

                if (Quest.hasOwnProperty("rewards")) {
                    for (var reward in Quest.rewards) {
                        if (Quest.rewards[reward].templateId.startsWith("Quest:")) {
                            for (var Q in SeasonQuestIDS.Quests) {
                                if (SeasonQuestIDS.Quests[Q].templateId == Quest.rewards[reward].templateId) {
                                    SeasonQuestIDS.ChallengeBundles[SeasonQuestIDS.Quests[Q].challenge_bundle_id].grantedquestinstanceids.push(Q)
                                    ParseQuest(Q)
                                }
                            }
                        }
                    }
                }
            }

            for (var i in Quest.objectives) {
                if (config.Profile.bCompletedSeasonalQuests == true) {
                    profile.items[QuestID].attributes[`completion_${i}`] = Quest.objectives[i];
                } else {
                    profile.items[QuestID].attributes[`completion_${i}`] = 0;
                }
            }

            ApplyProfileChanges.push({
                "changeType": "itemAdded",
                "itemId": QuestID,
                "item": profile.items[QuestID]
            })

            StatChanged = true;
        }

        for (var Quest in QuestsToAdd) {
            ParseQuest(QuestsToAdd[Quest])
        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Reset item STW
express.post("/fortnite/api/game/v2/profile/*/client/RefundItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        profile.items[req.body.targetItemId].templateId = `${profile.items[req.body.targetItemId].templateId.replace(/\d$/, '')}1`
        profile.items[req.body.targetItemId].attributes.level = 1;
        profile.items[req.body.targetItemId].attributes.refundable = false;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        const ID = functions.MakeID();

        profile.items[ID] = profile.items[req.body.targetItemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        delete profile.items[req.body.targetItemId]
        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.targetItemId
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Refund V-Bucks purchase
express.post("/fortnite/api/game/v2/profile/*/client/RefundMtxPurchase", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "common_core"}.json`);
    const ItemProfile = require("./../profiles/athena.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var ItemGuids = [];

    if (req.body.purchaseId) {
        MultiUpdate.push({
            "profileRevision": ItemProfile.rvn || 0,
            "profileId": "athena",
            "profileChangesBaseRevision": ItemProfile.rvn || 0,
            "profileChanges": [],
            "profileCommandRevision": ItemProfile.commandRevision || 0,
        })

        profile.stats.attributes.mtx_purchase_history.refundsUsed += 1;
        profile.stats.attributes.mtx_purchase_history.refundCredits -= 1;

        for (var i in profile.stats.attributes.mtx_purchase_history.purchases) {
            if (profile.stats.attributes.mtx_purchase_history.purchases[i].purchaseId == req.body.purchaseId) {
                for (var x in profile.stats.attributes.mtx_purchase_history.purchases[i].lootResult) {
                    ItemGuids.push(profile.stats.attributes.mtx_purchase_history.purchases[i].lootResult[x].itemGuid)
                }

                profile.stats.attributes.mtx_purchase_history.purchases[i].refundDate = new Date().toISOString();

                for (var key in profile.items) {
                    if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                        if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                            profile.items[key].quantity += profile.stats.attributes.mtx_purchase_history.purchases[i].totalMtxPaid;
        
                            ApplyProfileChanges.push({
                                "changeType": "itemQuantityChanged",
                                "itemId": key,
                                "quantity": profile.items[key].quantity
                            })
        
                            break;
                        }
                    }
                }
            }
        }

        for (var i in ItemGuids) {
			try {
				delete ItemProfile.items[ItemGuids[i]]

				MultiUpdate[0].profileChanges.push({
					"changeType": "itemRemoved",
					"itemId": ItemGuids[i]
				})
			} catch (err) {}
        }

        ItemProfile.rvn += 1;
        ItemProfile.commandRevision += 1;
        profile.rvn += 1;
        profile.commandRevision += 1;

        StatChanged = true;
    }

    if (StatChanged == true) {
        
        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "mtx_purchase_history",
            "value": profile.stats.attributes.mtx_purchase_history
        })

        MultiUpdate[0].profileRevision = ItemProfile.rvn || 0;
        MultiUpdate[0].profileCommandRevision = ItemProfile.commandRevision || 0;

        fs.writeFileSync(`./profiles/${req.query.profileId || "common_core"}.json`, JSON.stringify(profile, null, 2));
        fs.writeFileSync(`./profiles/athena.json`, JSON.stringify(ItemProfile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "common_core",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Increase a named counter value (e.g. when selecting a game mode)
express.post("/fortnite/api/game/v2/profile/*/client/IncrementNamedCounterStat", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.counterName && profile.stats.attributes.hasOwnProperty("named_counters")) {
        if (profile.stats.attributes.named_counters.hasOwnProperty(req.body.counterName)) {
            profile.stats.attributes.named_counters[req.body.counterName].current_count += 1;
            profile.stats.attributes.named_counters[req.body.counterName].last_incremented_time = new Date().toISOString();

            StatChanged = true;
        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "named_counters",
            "value": profile.stats.attributes.named_counters
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Claim STW daily reward
express.post("/fortnite/api/game/v2/profile/*/client/ClaimLoginReward", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    const DailyRewards = require("./../responses/Campaign/dailyRewards.json");
    const memory = functions.GetVersionInfo(req);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var DateFormat = (new Date().toISOString()).split("T")[0] + "T00:00:00.000Z";

    if (profile.stats.attributes.daily_rewards.lastClaimDate != DateFormat) {
        profile.stats.attributes.daily_rewards.nextDefaultReward += 1;
        profile.stats.attributes.daily_rewards.totalDaysLoggedIn += 1;
        profile.stats.attributes.daily_rewards.lastClaimDate = DateFormat;
        profile.stats.attributes.daily_rewards.additionalSchedules.founderspackdailyrewardtoken.rewardsClaimed += 1;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "daily_rewards",
            "value": profile.stats.attributes.daily_rewards
        })

        if (memory.season < 7) {
            var Day = profile.stats.attributes.daily_rewards.totalDaysLoggedIn % 336;
            Notifications.push({
                "type": "daily_rewards",
                "primary": true,
                "daysLoggedIn": profile.stats.attributes.daily_rewards.totalDaysLoggedIn,
                "items": [DailyRewards[Day]]
            })
        }

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Update quest client objectives
express.post("/fortnite/api/game/v2/profile/*/client/UpdateQuestClientObjectives", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.advance) {
        for (var i in req.body.advance) {
            var QuestsToUpdate = [];

            for (var x in profile.items) {
                if (profile.items[x].templateId.toLowerCase().startsWith("quest:")) {
                    for (var y in profile.items[x].attributes) {
                        if (y.toLowerCase() == `completion_${req.body.advance[i].statName}`) {
                            QuestsToUpdate.push(x)
                        }
                    }
                }
            }

            for (var i = 0; i < QuestsToUpdate.length; i++) {
                var bIncomplete = false;
                
                profile.items[QuestsToUpdate[i]].attributes[`completion_${req.body.advance[i].statName}`] = req.body.advance[i].count;

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": QuestsToUpdate[i],
                    "attributeName": `completion_${req.body.advance[i].statName}`,
                    "attributeValue": req.body.advance[i].count
                })

                if (profile.items[QuestsToUpdate[i]].attributes.quest_state.toLowerCase() != "claimed") {
                    for (var x in profile.items[QuestsToUpdate[i]].attributes) {
                        if (x.toLowerCase().startsWith("completion_")) {
                            if (profile.items[QuestsToUpdate[i]].attributes[x] == 0) {
                                bIncomplete = true;
                            }
                        }
                    }
    
                    if (bIncomplete == false) {
                        profile.items[QuestsToUpdate[i]].attributes.quest_state = "Claimed";
    
                        ApplyProfileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": QuestsToUpdate[i],
                            "attributeName": "quest_state",
                            "attributeValue": profile.items[QuestsToUpdate[i]].attributes.quest_state
                        })
                    }
                }

                StatChanged = true;
            }
        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Equip team perk STW
express.post("/fortnite/api/game/v2/profile/*/client/AssignTeamPerkToLoadout", async (req, res) => {
    const profile = require("./../profiles/campaign.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.loadoutId) {
        profile.items[req.body.loadoutId].attributes.team_perk = req.body.teamPerkId || "";
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "team_perk",
            "attributeValue": profile.items[req.body.loadoutId].attributes.team_perk
        })

        fs.writeFileSync("./profiles/campaign.json", JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Equip gadget STW
express.post("/fortnite/api/game/v2/profile/*/client/AssignGadgetToLoadout", async (req, res) => {
    const profile = require("./../profiles/campaign.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.loadoutId) {
        switch (req.body.slotIndex) {

            case 0:
                if (req.body.gadgetId.toLowerCase() == profile.items[req.body.loadoutId].attributes.gadgets[1].gadget.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.gadgets[1].gadget = "";
                }
                profile.items[req.body.loadoutId].attributes.gadgets[req.body.slotIndex].gadget = req.body.gadgetId || "";
                StatChanged = true;
                break;

            case 1:
                if (req.body.gadgetId.toLowerCase() == profile.items[req.body.loadoutId].attributes.gadgets[0].gadget.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.gadgets[0].gadget = "";
                }
                profile.items[req.body.loadoutId].attributes.gadgets[req.body.slotIndex].gadget = req.body.gadgetId || "";
                StatChanged = true;
                break;

        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "gadgets",
            "attributeValue": profile.items[req.body.loadoutId].attributes.gadgets
        })

        fs.writeFileSync("./profiles/campaign.json", JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Assign worker to squad STW
express.post("/fortnite/api/game/v2/profile/*/client/AssignWorkerToSquad", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.characterId) {
        for (var key in profile.items) {
            if (profile.items[key].hasOwnProperty('attributes')) {
                if (profile.items[key].attributes.hasOwnProperty('squad_id') && profile.items[key].attributes.hasOwnProperty('squad_slot_idx')) {
                    if (profile.items[key].attributes.squad_id != "" && profile.items[key].attributes.squad_slot_idx != -1) {
                        if (profile.items[key].attributes.squad_id.toLowerCase() == req.body.squadId.toLowerCase() && profile.items[key].attributes.squad_slot_idx == req.body.slotIndex) {
                            profile.items[key].attributes.squad_id = "";
                            profile.items[key].attributes.squad_slot_idx = 0;

                            ApplyProfileChanges.push({
                                "changeType": "itemAttrChanged",
                                "itemId": key,
                                "attributeName": "squad_id",
                                "attributeValue": profile.items[key].attributes.squad_id
                            })

                            ApplyProfileChanges.push({
                                "changeType": "itemAttrChanged",
                                "itemId": key,
                                "attributeName": "squad_slot_idx",
                                "attributeValue": profile.items[key].attributes.squad_slot_idx
                            })
                        }
                    }
                }
            }
        }
    }

    if (req.body.characterId) {
        profile.items[req.body.characterId].attributes.squad_id = req.body.squadId || "";
        profile.items[req.body.characterId].attributes.squad_slot_idx = req.body.slotIndex || 0;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.characterId,
            "attributeName": "squad_id",
            "attributeValue": profile.items[req.body.characterId].attributes.squad_id
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.characterId,
            "attributeName": "squad_slot_idx",
            "attributeValue": profile.items[req.body.characterId].attributes.squad_slot_idx
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Assign multiple workers to squad STW
express.post("/fortnite/api/game/v2/profile/*/client/AssignWorkerToSquadBatch", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.characterIds && req.body.squadIds && req.body.slotIndices) {
        for (var i in req.body.characterIds) {
            for (var key in profile.items) {
                if (profile.items[key].hasOwnProperty('attributes')) {
                    if (profile.items[key].attributes.hasOwnProperty('squad_id') && profile.items[key].attributes.hasOwnProperty('squad_slot_idx')) {
                        if (profile.items[key].attributes.squad_id != "" && profile.items[key].attributes.squad_slot_idx != -1) {
                            if (profile.items[key].attributes.squad_id.toLowerCase() == req.body.squadIds[i].toLowerCase() && profile.items[key].attributes.squad_slot_idx == req.body.slotIndices[i]) {
                                profile.items[key].attributes.squad_id = "";
                                profile.items[key].attributes.squad_slot_idx = 0;

                                ApplyProfileChanges.push({
                                    "changeType": "itemAttrChanged",
                                    "itemId": key,
                                    "attributeName": "squad_id",
                                    "attributeValue": profile.items[key].attributes.squad_id
                                })

                                ApplyProfileChanges.push({
                                    "changeType": "itemAttrChanged",
                                    "itemId": key,
                                    "attributeName": "squad_slot_idx",
                                    "attributeValue": profile.items[key].attributes.squad_slot_idx
                                })
                            }
                        }
                    }
                }
            }

            profile.items[req.body.characterIds[i]].attributes.squad_id = req.body.squadIds[i] || "";
            profile.items[req.body.characterIds[i]].attributes.squad_slot_idx = req.body.slotIndices[i] || 0;

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": req.body.characterIds[i],
                "attributeName": "squad_id",
                "attributeValue": profile.items[req.body.characterIds[i]].attributes.squad_id
            })

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": req.body.characterIds[i],
                "attributeName": "squad_slot_idx",
                "attributeValue": profile.items[req.body.characterIds[i]].attributes.squad_slot_idx
            })
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Claim STW quest reward
express.post("/fortnite/api/game/v2/profile/*/client/ClaimQuestReward", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    const common_core = require("./../profiles/common_core.json");
    const theater0 = require("./../profiles/theater0.json");
    var Rewards = require("./../responses/Campaign/rewards.json").quest;

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    var TheaterStatChanged = false;
    var CommonCoreStatChanged = false;

    if (req.body.questId) {
        var questTemplateId = [];
        for (var key in profile.items) {
            if (req.body.questId.toLowerCase() == key.toLowerCase()) {
                questTemplateId = profile.items[key].templateId.toLowerCase();
            }
        }

        if (questTemplateId && Rewards.hasOwnProperty(questTemplateId)) {
            if (req.body.selectedRewardIndex != -1 && Rewards[questTemplateId].selectableRewards) {
                Rewards = Rewards[questTemplateId].selectableRewards[req.body.selectedRewardIndex].rewards;
            }
            else {
                Rewards = Rewards[questTemplateId].rewards;
            }

            MultiUpdate.push({
                "profileRevision": theater0.rvn || 0,
                "profileId": "theater0",
                "profileChangesBaseRevision": theater0.rvn || 0,
                "profileChanges": [],
                "profileCommandRevision": theater0.commandRevision || 0,
            })

            if (req.query.profileId == "campaign") {
                MultiUpdate.push({
                    "profileRevision": common_core.rvn || 0,
                    "profileId": "common_core",
                    "profileChangesBaseRevision": common_core.rvn || 0,
                    "profileChanges": [],
                    "profileCommandRevision": common_core.commandRevision || 0,
                })
            }

            Notifications.push({
                "type": "questClaim",
                "primary": true,
                "questId": questTemplateId,
                "loot": {
                    "items": []
                }
            })

            for (var i in Rewards) {
                const ID = functions.MakeID();
                const templateId = Rewards[i].templateId.toLowerCase();

                if (templateId.startsWith("weapon:") || templateId.startsWith("trap:") || templateId.startsWith("ammo:")) {
                    var Item = {"templateId":Rewards[i].templateId,"attributes":{"clipSizeScale": 0,"loadedAmmo": 999,"level": 1,"alterationDefinitions": [],"baseClipSize": 999,"durability": 375,"itemSource": "", "item_seen": false},"quantity":Rewards[i].quantity};
                    
                    theater0.items[ID] = Item;

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": theater0.items[ID]
                    })

                    Notifications[0].loot.items.push({
                        "itemType": Rewards[i].templateId,
                        "itemGuid": ID,
                        "itemProfile": "theater0",
                        "quantity": Rewards[i].quantity
                    })

                    TheaterStatChanged = true;
                }
                else if (req.query.profileId == "campaign" && (templateId.startsWith("homebasebannericon:") || templateId == "token:founderchatunlock")) {
                    var Item = {"templateId":Rewards[i].templateId,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"favorite":false},"quantity":Rewards[i].quantity};
                    
                    common_core.items[ID] = Item;

                    MultiUpdate[1].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": common_core.items[ID]
                    })

                    Notifications[0].loot.items.push({
                        "itemType": Rewards[i].templateId,
                        "itemGuid": ID,
                        "itemProfile": "common_core",
                        "quantity": Rewards[i].quantity
                    })

                    CommonCoreStatChanged = true;
                }
                else {
                    var Item = {"templateId":Rewards[i].templateId,"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":Rewards[i].quantity};
                    
                    if (templateId.startsWith("quest:")) {
                        Item.attributes.quest_state = "Active";
                    }

                    profile.items[ID] = Item;

                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": profile.items[ID]
                    })
                    
                    Notifications[0].loot.items.push({
                        "itemType": Rewards[i].templateId,
                        "itemGuid": ID,
                        "itemProfile": req.query.profileId,
                        "quantity": Rewards[i].quantity
                    })
                }
            }
        }

        profile.items[req.body.questId].attributes.quest_state = "Claimed";
        profile.items[req.body.questId].attributes.last_state_change_time = new Date().toISOString();
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        if (TheaterStatChanged == true) {
            theater0.rvn += 1;
            theater0.commandRevision += 1;
            MultiUpdate[0].profileRevision = theater0.rvn || 0;
            MultiUpdate[0].profileCommandRevision = theater0.commandRevision || 0;

            fs.writeFileSync("./profiles/theater0.json", JSON.stringify(theater0, null, 2));
        }

        if (CommonCoreStatChanged == true) {
            common_core.rvn += 1;
            common_core.commandRevision += 1;
            MultiUpdate[1].profileRevision = common_core.rvn || 0;
            MultiUpdate[1].profileCommandRevision = common_core.commandRevision || 0;

            fs.writeFileSync("./profiles/common_core.json", JSON.stringify(common_core, null, 2));
        }

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.questId,
            "attributeName": "quest_state",
            "attributeValue": profile.items[req.body.questId].attributes.quest_state
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.questId,
            "attributeName": "last_state_change_time",
            "attributeValue": profile.items[req.body.questId].attributes.last_state_change_time
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Level item up STW 1
express.post("/fortnite/api/game/v2/profile/*/client/UpgradeItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        profile.items[req.body.targetItemId].attributes.level += 1;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "level",
            "attributeValue": profile.items[req.body.targetItemId].attributes.level
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Level slotted item up STW
express.post("/fortnite/api/game/v2/profile/*/client/UpgradeSlottedItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "collection_book_people0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        if (req.body.desiredLevel) {
            var new_level = Number(req.body.desiredLevel);

            profile.items[req.body.targetItemId].attributes.level = new_level;
        } else {
            profile.items[req.body.targetItemId].attributes.level += 1;
        }
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "level",
            "attributeValue": profile.items[req.body.targetItemId].attributes.level
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "collection_book_people0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "collection_book_people0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Level item up STW 2
express.post("/fortnite/api/game/v2/profile/*/client/UpgradeItemBulk", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        var new_level = Number(req.body.desiredLevel);

        profile.items[req.body.targetItemId].attributes.level = new_level;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "level",
            "attributeValue": profile.items[req.body.targetItemId].attributes.level
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Evolve item STW

app.post("/fortnite/api/game/v2/profile/*/client/SetReceiveGiftsEnabled", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    let profile = profiles.profiles[req.query.profileId];

    if (req.query.profileId != "common_core") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `SetReceiveGiftsEnabled is not valid on ${req.query.profileId} profile`, 
        ["SetReceiveGiftsEnabled",req.query.profileId], 12801, undefined, 400, res
    );

    const memory = functions.GetVersionInfo(req);

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    if (typeof req.body.bReceiveGifts != "boolean") return ValidationError("bReceiveGifts", "a boolean", res);

    profile.stats.attributes.allowed_to_receive_gifts = req.body.bReceiveGifts;

    ApplyProfileChanges.push({
        "changeType": "statModified",
        "name": "allowed_to_receive_gifts",
        "value": profile.stats.attributes.allowed_to_receive_gifts
    });

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

// Evolve item STW
express.post("/fortnite/api/game/v2/profile/*/client/ConvertItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t04")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t04/ig, "T05");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t03")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t03/ig, "T04");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t02")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t02/ig, "T03");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t01")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t01/ig, "T02");
        }

        // Conversion Index: 0 = Ore, 1 = Crystal
        if (req.body.conversionIndex == 1) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/ore/ig, "Crystal");
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        const ID = functions.MakeID();

        profile.items[ID] = profile.items[req.body.targetItemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        delete profile.items[req.body.targetItemId]
        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.targetItemId
        })

        Notifications.push({
            "type": "conversionResult",
            "primary": true,
            "itemsGranted": [
                {
                    "itemType": profile.items[ID].templateId,
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId || "campaign",
                    "attributes": {
                        "level": profile.items[ID].attributes.level,
                        "alterations": profile.items[ID].attributes.alterations || []
                    },
                    "quantity": 1
                }
            ]
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Evolve slotted item STW
express.post("/fortnite/api/game/v2/profile/*/client/ConvertSlottedItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "collection_book_people0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t04")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t04/ig, "T05");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t03")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t03/ig, "T04");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t02")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t02/ig, "T03");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("t01")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/t01/ig, "T02");
        }

        // Conversion Index: 0 = Ore, 1 = Crystal
        if (req.body.conversionIndex == 1) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/ore/ig, "Crystal");
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        const ID = functions.MakeID();

        profile.items[ID] = profile.items[req.body.targetItemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        delete profile.items[req.body.targetItemId]
        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.targetItemId
        })

        Notifications.push({
            "type": "conversionResult",
            "primary": true,
            "itemsGranted": [
                {
                    "itemType": profile.items[ID].templateId,
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId || "collection_book_people0",
                    "attributes": {
                        "level": profile.items[ID].attributes.level,
                        "alterations": profile.items[ID].attributes.alterations || []
                    },
                    "quantity": 1
                }
            ]
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "collection_book_people0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "collection_book_people0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Upgrade item rarity STW
express.post("/fortnite/api/game/v2/profile/*/client/UpgradeItemRarity", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("_vr_")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/_vr_/ig, "_SR_");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("_r_")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/_r_/ig, "_VR_");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("_uc_")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/_uc_/ig, "_R_");
        }

        if (profile.items[req.body.targetItemId].templateId.toLowerCase().includes("_c_")) {
            profile.items[req.body.targetItemId].templateId = profile.items[req.body.targetItemId].templateId.replace(/_c_/ig, "_UC_");
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        const ID = functions.MakeID();

        profile.items[ID] = profile.items[req.body.targetItemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        delete profile.items[req.body.targetItemId]
        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.targetItemId
        })

        Notifications.push([{
            "type": "upgradeItemRarityNotification",
            "primary": true,
            "itemsGranted": [
                {
                    "itemType": profile.items[ID].templateId,
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId || "campaign",
                    "attributes": {
                        "level": profile.items[ID].attributes.level,
                        "alterations": profile.items[ID].attributes.alterations || []
                    },
                    "quantity": 1
                }
            ]
        }])

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Super charge item STW
express.post("/fortnite/api/game/v2/profile/*/client/PromoteItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        profile.items[req.body.targetItemId].attributes.level += 2;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "level",
            "attributeValue": profile.items[req.body.targetItemId].attributes.level
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Transform items STW
express.post("/fortnite/api/game/v2/profile/*/client/TransmogItem", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    var transformItemIDS = require("./../responses/Campaign/transformItemIDS.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.sacrificeItemIds && req.body.transmogKeyTemplateId) {
        for (var i in req.body.sacrificeItemIds) {
            var id = req.body.sacrificeItemIds[i];

            delete profile.items[id];

            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": id
            })
        }

        if (transformItemIDS.hasOwnProperty(req.body.transmogKeyTemplateId)) {
            transformItemIDS = transformItemIDS[req.body.transmogKeyTemplateId]
        }
        else {
            transformItemIDS = require("./../responses/Campaign/cardPackData.json").default;
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        const randomNumber = Math.floor(Math.random() * transformItemIDS.length);
        const ID = functions.MakeID();
        var Item = {"templateId":transformItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
        if (transformItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
            Item.attributes = functions.MakeSurvivorAttributes(transformItemIDS[randomNumber]);
        }

        profile.items[ID] = Item;

        Notifications.push({
            "type": "transmogResult",
            "primary": true,
            "transmoggedItems": [
                {
                    "itemType": profile.items[ID].templateId,
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId || "campaign",
                    "attributes": profile.items[ID].attributes,
                    "quantity": 1
                }
            ]
        })

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": Item
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Craft item STW (Guns, melees and traps only)
express.post("/fortnite/api/game/v2/profile/*/client/CraftWorldItem", async (req, res) => {
    const memory = functions.GetVersionInfo(req);

    const profile = require(`./../profiles/${req.query.profileId || "theater0"}.json`);
    var schematic_profile;
    // do not change this
    var chosen_profile = false;

    if (4 <= memory.season || memory.build == 3.5 || memory.build == 3.6 && chosen_profile == false) {
        schematic_profile = require("./../profiles/campaign.json");
        chosen_profile = true;
    }

    if (3 >= memory.season && chosen_profile == false) {
        schematic_profile = require("./../profiles/profile0.json");
        chosen_profile = true;
    }

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var Item;
    const ID = functions.MakeID();

    if (req.body.targetSchematicItemId) {
        var Body = '';
        Body += JSON.stringify(schematic_profile.items[req.body.targetSchematicItemId]);
        Item = JSON.parse(Body);

        var ItemType = 'Weapon:';
        var ItemIDType = 'WID_';
        if (Item.templateId.split("_")[1].split("_")[0].toLowerCase() == "wall") {
            ItemType = "Trap:";
            ItemIDType = "TID_";
        }
        if (Item.templateId.split("_")[1].split("_")[0].toLowerCase() == "floor") {
            ItemType = "Trap:";
            ItemIDType = "TID_";
        }
        if (Item.templateId.split("_")[1].split("_")[0].toLowerCase() == "ceiling") {
            ItemType = "Trap:";
            ItemIDType = "TID_";
        }

        // Fixes for items that have a slightly different WID from the SID    
        // Lightning Pistol    
        if (Item.templateId.toLowerCase().startsWith("schematic:sid_pistol_vacuumtube_auto_")) {
            Item.templateId = `Schematic:SID_Pistol_Auto_VacuumTube_${Item.templateId.substring(37)}`
        }
        // Snowball Launcher
        if (Item.templateId.toLowerCase().startsWith("schematic:sid_launcher_grenade_winter_")) {
            Item.templateId = `Schematic:SID_Launcher_WinterGrenade_${Item.templateId.substring(38)}`
        }

        Item.templateId = Item.templateId.replace(/schematic:/ig, ItemType);
        Item.templateId = Item.templateId.replace(/sid_/ig, ItemIDType);
        Item.quantity = req.body.numTimesToCraft || 1;
        if (req.body.targetSchematicTier) {
            switch (req.body.targetSchematicTier.toLowerCase()) {

                case "i":
                    if (!Item.templateId.toLowerCase().includes("t01")) {
                        Item.attributes.level = 10;
                    }
                    Item.templateId = Item.templateId.substring(0, Item.templateId.length-3) + "T01"
                    Item.templateId = Item.templateId.replace(/_crystal_/ig, "_Ore_")
                break;

                case "ii":
                    if (!Item.templateId.toLowerCase().includes("t02")) {
                        Item.attributes.level = 20;
                    }
                    Item.templateId = Item.templateId.substring(0, Item.templateId.length-3) + "T02"
                    Item.templateId = Item.templateId.replace(/_crystal_/ig, "_Ore_")
                break;

                case "iii":
                    if (!Item.templateId.toLowerCase().includes("t03")) {
                        Item.attributes.level = 30;
                    }
                    Item.templateId = Item.templateId.substring(0, Item.templateId.length-3) + "T03"
                    Item.templateId = Item.templateId.replace(/_crystal_/ig, "_Ore_")
                break;

                case "iv":
                    if (!Item.templateId.toLowerCase().includes("t04")) {
                        Item.attributes.level = 40;
                    }
                    Item.templateId = Item.templateId.substring(0, Item.templateId.length-3) + "T04"
                break;

                case "v":
                    Item.templateId = Item.templateId.substring(0, Item.templateId.length-3) + "T05"
                break;
            }
        }

        Item.attributes = {
            "clipSizeScale": 0,
            "loadedAmmo": 999,
            "level": Item.attributes.level || 1,
            "alterationDefinitions": Item.attributes.alterations || [],
            "baseClipSize": 999,
            "durability": 375,
            "itemSource": ""
        };

        profile.items[ID] = Item;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        });

        Notifications.push({
            "type": "craftingResult",
            "primary": true,
            "itemsCrafted": [
                {
                    "itemType": profile.items[ID].templateId,
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId || "theater0",
                    "attributes": {
                        "loadedAmmo": profile.items[ID].attributes.loadedAmmo,
                        "level": profile.items[ID].attributes.level,
                        "alterationDefinitions": profile.items[ID].attributes.alterationDefinitions,
                        "durability": profile.items[ID].attributes.durability
                    },
                    "quantity": profile.items[ID].quantity
                }
            ]
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "theater0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "theater0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Destroy item STW
express.post("/fortnite/api/game/v2/profile/*/client/DestroyWorldItems", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "theater0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.itemIds) {
        for (var i in req.body.itemIds) {
            var id = req.body.itemIds[i];
            delete profile.items[id]

            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": id
            })
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "theater0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "theater0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Disassemble items STW
express.post("/fortnite/api/game/v2/profile/*/client/DisassembleWorldItems", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "theater0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemIdAndQuantityPairs) {
        for (var i in req.body.targetItemIdAndQuantityPairs) {
            var id = req.body.targetItemIdAndQuantityPairs[i].itemId;
            var quantity = Number(req.body.targetItemIdAndQuantityPairs[i].quantity);
            var orig_quantity = Number(profile.items[id].quantity);

            if (quantity >= orig_quantity) {
                delete profile.items[id]

                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": id
                })
            }

            if (quantity < orig_quantity) {
                profile.items[id].quantity -= quantity;

                ApplyProfileChanges.push({
                    "changeType": "itemQuantityChanged",
                    "itemId": id,
                    "quantity": profile.items[id].quantity
                })
            }
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "theater0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "theater0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Storage transfer STW
express.post("/fortnite/api/game/v2/profile/*/client/StorageTransfer", async (req, res) => {
    const theater0 = require("./../profiles/theater0.json");
    const outpost0 = require("./../profiles/outpost0.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var BaseRevision = theater0.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.transferOperations) {
        MultiUpdate.push({
            "profileRevision": outpost0.rvn || 0,
            "profileId": "outpost0",
            "profileChangesBaseRevision": outpost0.rvn || 0,
            "profileChanges": [],
            "profileCommandRevision": outpost0.commandRevision || 0,
        })

        for (var i in req.body.transferOperations) {
            if (req.body.transferOperations[i].toStorage == false) {
                let id = req.body.transferOperations[i].itemId;
                let body_quantity = Number(req.body.transferOperations[i].quantity);
                if (outpost0.items[id]) {
                    var outpost0_quantity = Number(outpost0.items[id].quantity);
                } else {
                    var outpost0_quantity = "Unknown";
                }
                if (theater0.items[id]) {
                    var theater0_quantity = Number(theater0.items[id].quantity);
                } else {
                    var theater0_quantity = "Unknown";
                }

                if (theater0.items[id] && outpost0.items[id]) {
                    if (outpost0_quantity > body_quantity) {
                        theater0.items[id].quantity += body_quantity;
                        outpost0.items[id].quantity -= body_quantity;

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        })
                    }

                    if (outpost0_quantity <= body_quantity) {
                        theater0.items[id].quantity += body_quantity;

                        delete outpost0.items[id]

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id
                        });
                    }
                }

                if (!theater0.items[id] && outpost0.items[id]) {
                    const Item = JSON.parse(JSON.stringify(outpost0.items[id]));

                    if (outpost0_quantity > body_quantity) {
                        outpost0.items[id].quantity -= body_quantity;

                        Item.quantity = body_quantity;

                        theater0.items[id] = Item;

                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        });
                    }

                    if (outpost0_quantity <= body_quantity) {
                        theater0.items[id] = Item;

                        delete outpost0.items[id]

                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id
                        })
                    }
                }
            }

            if (req.body.transferOperations[i].toStorage == true) {
                let id = req.body.transferOperations[i].itemId;
                let body_quantity = Number(req.body.transferOperations[i].quantity);
                if (outpost0.items[id]) {
                    var outpost0_quantity = Number(outpost0.items[id].quantity);
                } else {
                    var outpost0_quantity = "Unknown";
                }
                if (theater0.items[id]) {
                    var theater0_quantity = Number(theater0.items[id].quantity);
                } else {
                    var theater0_quantity = "Unknown";
                }

                if (outpost0.items[id] && theater0.items[id]) {
                    if (theater0_quantity > body_quantity) {
                        outpost0.items[id].quantity += body_quantity;
                        theater0.items[id].quantity -= body_quantity;

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        })
                    }

                    if (theater0_quantity <= body_quantity) {
                        outpost0.items[id].quantity += body_quantity;

                        delete theater0.items[id]

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        });

                        ApplyProfileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id
                        });
                    }
                }

                if (!outpost0.items[id] && theater0.items[id]) {
                    const Item = JSON.parse(JSON.stringify(theater0.items[id]));

                    if (theater0_quantity > body_quantity) {
                        theater0.items[id].quantity -= body_quantity;

                        Item.quantity = body_quantity;

                        outpost0.items[id] = Item;

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });
                    }

                    if (theater0_quantity <= body_quantity) {
                        outpost0.items[id] = Item;

                        delete theater0.items[id]

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        ApplyProfileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id,
                        })
                    }
                }
            }
        }

        StatChanged = true;
    }

    if (req.body.theaterToOutpostItems && req.body.outpostToTheaterItems) {
        MultiUpdate.push({
            "profileRevision": outpost0.rvn || 0,
            "profileId": "outpost0",
            "profileChangesBaseRevision": outpost0.rvn || 0,
            "profileChanges": [],
            "profileCommandRevision": outpost0.commandRevision || 0,
        })

        for (var i in req.body.theaterToOutpostItems) {
            let id = req.body.theaterToOutpostItems[i].itemId;
            let body_quantity = Number(req.body.theaterToOutpostItems[i].quantity);
            if (outpost0.items[id]) {
                var outpost0_quantity = Number(outpost0.items[id].quantity);
            } else {
                var outpost0_quantity = "Unknown";
            }
            if (theater0.items[id]) {
                var theater0_quantity = Number(theater0.items[id].quantity);
            } else {
                var theater0_quantity = "Unknown";
            }

            if (outpost0.items[id] && theater0.items[id]) {
                if (theater0_quantity > body_quantity) {
                    outpost0.items[id].quantity += body_quantity;
                    theater0.items[id].quantity -= body_quantity;

                    ApplyProfileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": id,
                        "quantity": theater0.items[id].quantity
                    });

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": id,
                        "quantity": outpost0.items[id].quantity
                    })
                }

                if (theater0_quantity <= body_quantity) {
                    outpost0.items[id].quantity += body_quantity;

                    delete theater0.items[id]

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": id,
                        "quantity": outpost0.items[id].quantity
                    });

                    ApplyProfileChanges.push({
                        "changeType": "itemRemoved",
                        "itemId": id
                    });
                }
            }

            if (!outpost0.items[id] && theater0.items[id]) {
                const Item = JSON.parse(JSON.stringify(theater0.items[id]));

                if (theater0_quantity > body_quantity) {
                    theater0.items[id].quantity -= body_quantity;

                    Item.quantity = body_quantity;

                    outpost0.items[id] = Item;

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": id,
                        "item": Item
                    })

                    ApplyProfileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": id,
                        "quantity": theater0.items[id].quantity
                    });
                }

                if (theater0_quantity <= body_quantity) {
                    outpost0.items[id] = Item;

                    delete theater0.items[id]

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": id,
                        "item": Item
                    })

                    ApplyProfileChanges.push({
                        "changeType": "itemRemoved",
                        "itemId": id,
                    })
                }
            }
        }

            for (var i in req.body.outpostToTheaterItems) {
                let id = req.body.outpostToTheaterItems[i].itemId;
                let body_quantity = Number(req.body.outpostToTheaterItems[i].quantity);
                if (outpost0.items[id]) {
                    var outpost0_quantity = Number(outpost0.items[id].quantity);
                } else {
                    var outpost0_quantity = "Unknown";
                }
                if (theater0.items[id]) {
                    var theater0_quantity = Number(theater0.items[id].quantity);
                } else {
                    var theater0_quantity = "Unknown";
                }

                if (theater0.items[id] && outpost0.items[id]) {
                    if (outpost0_quantity > body_quantity) {
                        theater0.items[id].quantity += body_quantity;
                        outpost0.items[id].quantity -= body_quantity;

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        })
                    }

                    if (outpost0_quantity <= body_quantity) {
                        theater0.items[id].quantity += body_quantity;

                        delete outpost0.items[id]

                        ApplyProfileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": theater0.items[id].quantity
                        });

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id
                        });
                    }
                }

                if (!theater0.items[id] && outpost0.items[id]) {
                    const Item = JSON.parse(JSON.stringify(outpost0.items[id]));

                    if (outpost0_quantity > body_quantity) {
                        outpost0.items[id].quantity -= body_quantity;

                        Item.quantity = body_quantity;

                        theater0.items[id] = Item;

                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemQuantityChanged",
                            "itemId": id,
                            "quantity": outpost0.items[id].quantity
                        });
                    }

                    if (outpost0_quantity <= body_quantity) {
                        theater0.items[id] = Item;

                        delete outpost0.items[id]

                        ApplyProfileChanges.push({
                            "changeType": "itemAdded",
                            "itemId": id,
                            "item": Item
                        })

                        MultiUpdate[0].profileChanges.push({
                            "changeType": "itemRemoved",
                            "itemId": id
                        })
                    }
                }
            }

        StatChanged = true;
    }

    if (StatChanged == true) {
        theater0.rvn += 1;
        theater0.commandRevision += 1;
        outpost0.rvn += 1;
        outpost0.commandRevision += 1;

        MultiUpdate[0].profileRevision = outpost0.rvn || 0;
        MultiUpdate[0].profileCommandRevision = outpost0.commandRevision || 0;

        fs.writeFileSync("./profiles/theater0.json", JSON.stringify(theater0, null, 2));
        fs.writeFileSync("./profiles/outpost0.json", JSON.stringify(outpost0, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": theater0
        }];
    }

    res.json({
        "profileRevision": theater0.rvn || 0,
        "profileId": "theater0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": theater0.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Modify quickbar STW
express.post("/fortnite/api/game/v2/profile/*/client/ModifyQuickbar", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "theater0"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.primaryQuickbarChoices) {
        for (var i in req.body.primaryQuickbarChoices) {
            let a = Number(i) + 1;
            var value = [req.body.primaryQuickbarChoices[i].replace(/-/ig, "").toUpperCase()];
            if (req.body.primaryQuickbarChoices[i] == "") {
                value = [];
            }

            profile.stats.attributes.player_loadout.primaryQuickBarRecord.slots[a].items = value;
        }

        StatChanged = true;
    }

    if (typeof req.body.secondaryQuickbarChoice == "string") {
        var value = [req.body.secondaryQuickbarChoice.replace(/-/ig, "").toUpperCase()];
        if (req.body.secondaryQuickbarChoice == "") {
            value = [];
        }

        profile.stats.attributes.player_loadout.secondaryQuickBarRecord.slots[5].items = value;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "player_loadout",
            "value": profile.stats.attributes.player_loadout
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "theater0"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "theater0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Hero equipping STW
express.post("/fortnite/api/game/v2/profile/*/client/AssignHeroToLoadout", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.loadoutId && req.body.slotName) {
        switch (req.body.slotName) {
            case "CommanderSlot":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot1.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot2.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot3.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot4.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot5.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = req.body.heroId || "";

                StatChanged = true;
            break;

            case "FollowerSlot1":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.commanderslot.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot2.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot3.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot4.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot5.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = req.body.heroId || "";

                StatChanged = true;
            break;

            case "FollowerSlot2":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot1.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.commanderslot.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot3.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot4.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot5.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = req.body.heroId || "";

                StatChanged = true;
            break;

            case "FollowerSlot3":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot1.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot2.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.commanderslot.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot4.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot5.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = req.body.heroId || "";

                StatChanged = true;
            break;

            case "FollowerSlot4":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot1.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot2.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot3.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.commanderslot.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot5.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = req.body.heroId || "";

                StatChanged = true;
            break;

            case "FollowerSlot5":
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot1.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot1 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot2.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot2 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot3.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot3 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.followerslot4.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.followerslot4 = "";
                }
                if (req.body.heroId.toLowerCase() == profile.items[req.body.loadoutId].attributes.crew_members.commanderslot.toLowerCase()) {
                    profile.items[req.body.loadoutId].attributes.crew_members.commanderslot = "";
                }

                profile.items[req.body.loadoutId].attributes.crew_members.followerslot5 = req.body.heroId || "";

                StatChanged = true;
            break;
        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "crew_members",
            "attributeValue": profile.items[req.body.loadoutId].attributes.crew_members
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});


// Clear hero loadout STW
express.post("/fortnite/api/game/v2/profile/*/client/ClearHeroLoadout", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.loadoutId) {
        profile.items[req.body.loadoutId].attributes = {
            "team_perk": "",
            "loadout_name": profile.items[req.body.loadoutId].attributes.loadout_name,
            "crew_members": {
                "followerslot5": "",
                "followerslot4": "",
                "followerslot3": "",
                "followerslot2": "",
                "followerslot1": "",
                "commanderslot": profile.items[req.body.loadoutId].attributes.crew_members.commanderslot
            },
            "loadout_index": profile.items[req.body.loadoutId].attributes.loadout_index,
            "gadgets": [
                {
                    "gadget": "",
                    "slot_index": 0
                },
                {
                    "gadget": "",
                    "slot_index": 1
                }
            ]
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "team_perk",
            "attributeValue": profile.items[req.body.loadoutId].attributes.team_perk
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "crew_members",
            "attributeValue": profile.items[req.body.loadoutId].attributes.crew_members
        })

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.loadoutId,
            "attributeName": "gadgets",
            "attributeValue": profile.items[req.body.loadoutId].attributes.gadgets
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Recycle items STW
express.post("/fortnite/api/game/v2/profile/*/client/RecycleItemBatch", async (req, res) => {
    const memory = functions.GetVersionInfo(req);

    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    var ItemExists = false;

    if (req.body.targetItemIds) {
        for (var i in req.body.targetItemIds) {
            let id = req.body.targetItemIds[i];

            if (memory.season > 11 || memory.build == 11.30 || memory.build == 11.31 || memory.build == 11.40 || memory.build == 11.50) {
                var collection_book_profile = require("./../profiles/collection_book_people0.json");

                if (profile.items[id].templateId.toLowerCase().startsWith("schematic:")) {
                    collection_book_profile = require("./../profiles/collection_book_schematics0.json");
                }

                if (MultiUpdate.length == 0) {
                    MultiUpdate.push({
                        "profileRevision": collection_book_profile.rvn || 0,
                        "profileId": collection_book_profile.profileId || "collection_book_people0",
                        "profileChangesBaseRevision": collection_book_profile.rvn || 0,
                        "profileChanges": [],
                        "profileCommandRevision": collection_book_profile.commandRevision || 0,
                    })
                }

                for (var key in collection_book_profile.items) {
                    const Template1 = profile.items[id].templateId;
                    const Template2 = collection_book_profile.items[key].templateId;
                    if (Template1.substring(0, Template1.length - 4).toLowerCase() == Template2.substring(0, Template2.length - 4).toLowerCase()) {
                        if (Template1.toLowerCase().startsWith("worker:") && Template2.toLowerCase().startsWith("worker:")) {
                            if (profile.items[id].attributes.hasOwnProperty("personality") && collection_book_profile.items[key].attributes.hasOwnProperty("personality")) {
                                const Personality1 = profile.items[id].attributes.personality;
                                const Personality2 = collection_book_profile.items[key].attributes.personality;

                                if (Personality1.toLowerCase() == Personality2.toLowerCase()) {
                                    if (profile.items[id].attributes.level > collection_book_profile.items[key].attributes.level) {
                                        delete collection_book_profile.items[key];

                                        MultiUpdate[0].profileChanges.push({
                                            "changeType": "itemRemoved",
                                            "itemId": key
                                        })

                                        ItemExists = false;
                                    } else {
                                        ItemExists = true;
                                    }
                                }
                            }
                        } else {
                            if (profile.items[id].attributes.level > collection_book_profile.items[key].attributes.level) {
                                delete collection_book_profile.items[key];

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "itemRemoved",
                                    "itemId": key
                                })

                                ItemExists = false;
                            } else {
                                ItemExists = true;
                            }
                        }
                    }
                }

                if (ItemExists == false) {
                    collection_book_profile.items[id] = profile.items[id];
                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": id,
                        "item": collection_book_profile.items[id]
                    })

                    Notifications.push({
                        "type": "slotItemResult",
                        "primary": true,
                        "slottedItemId": id
                    })
                }

                delete profile.items[id];
                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": id
                })

                collection_book_profile.rvn += 1;
                collection_book_profile.commandRevision += 1;

                MultiUpdate[0].profileRevision = collection_book_profile.rvn;
                MultiUpdate[0].profileCommandRevision = collection_book_profile.commandRevision;

                fs.writeFileSync(`./profiles/${collection_book_profile.profileId || "collection_book_people0"}.json`, JSON.stringify(collection_book_profile, null, 2));
            } else {
                delete profile.items[id];

                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": id
                })
            }
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Add item from collection book STW
express.post("/fortnite/api/game/v2/profile/*/client/ResearchItemFromCollectionBook", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    const ID = functions.MakeID();

    if (req.body.templateId) {
        profile.items[ID] = {
            "templateId": req.body.templateId,
            "attributes": {
                "last_state_change_time": "2017-08-29T21:05:57.087Z",
                "max_level_bonus": 0,
                "level": 1,
                "item_seen": false,
                "xp": 0,
                "sent_new_notification": true,
                "favorite": false
            },
            "quantity": 1
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Slot item in collection book STW
express.post("/fortnite/api/game/v2/profile/*/client/SlotItemInCollectionBook", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var collection_book_profile = require("./../profiles/collection_book_people0.json");

    if (profile.items[req.body.itemId].templateId.toLowerCase().startsWith("schematic:")) {
        collection_book_profile = require("./../profiles/collection_book_schematics0.json");
    }

    if (req.body.itemId) {
        MultiUpdate.push({
            "profileRevision": collection_book_profile.rvn || 0,
            "profileId": collection_book_profile.profileId || "collection_book_people0",
            "profileChangesBaseRevision": collection_book_profile.rvn || 0,
            "profileChanges": [],
            "profileCommandRevision": collection_book_profile.commandRevision || 0,
        })

        for (var key in collection_book_profile.items) {
            const Template1 = profile.items[req.body.itemId].templateId;
            const Template2 = collection_book_profile.items[key].templateId;
            if (Template1.substring(0, Template1.length-4).toLowerCase() == Template2.substring(0, Template2.length-4).toLowerCase()) {
                if (Template1.toLowerCase().startsWith("worker:") && Template2.toLowerCase().startsWith("worker:")) {
                    if (profile.items[req.body.itemId].attributes.hasOwnProperty("personality") && collection_book_profile.items[key].attributes.hasOwnProperty("personality")) {
                        const Personality1 = profile.items[req.body.itemId].attributes.personality;
                        const Personality2 = collection_book_profile.items[key].attributes.personality;

                        if (Personality1.toLowerCase() == Personality2.toLowerCase()) {
                            delete collection_book_profile.items[key];

                            MultiUpdate[0].profileChanges.push({
                                "changeType": "itemRemoved",
                                "itemId": key
                            })
                        }
                    }
                } else {
                    delete collection_book_profile.items[key];

                    MultiUpdate[0].profileChanges.push({
                        "changeType": "itemRemoved",
                        "itemId": key
                    })
                }
            }
        }

        collection_book_profile.items[req.body.itemId] = profile.items[req.body.itemId];

        delete profile.items[req.body.itemId];

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        collection_book_profile.rvn += 1;
        collection_book_profile.commandRevision += 1;

        MultiUpdate[0].profileRevision = collection_book_profile.rvn || 0;
        MultiUpdate[0].profileCommandRevision = collection_book_profile.commandRevision || 0;

        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.itemId
        })

        MultiUpdate[0].profileChanges.push({
            "changeType": "itemAdded",
            "itemId": req.body.itemId,
            "item": collection_book_profile.items[req.body.itemId]
        })

        Notifications.push({
            "type": "slotItemResult",
            "primary": true,
            "slottedItemId": req.body.itemId
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
        fs.writeFileSync(`./profiles/${collection_book_profile.profileId || "collection_book_people0"}.json`, JSON.stringify(collection_book_profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Unslot item from collection book STW
express.post("/fortnite/api/game/v2/profile/*/client/UnslotItemFromCollectionBook", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var collection_book_profile = require("./../profiles/collection_book_people0.json");

    if (req.body.templateId.toLowerCase().startsWith("schematic:")) {
        collection_book_profile = require("./../profiles/collection_book_schematics0.json");
    }

    const ID = functions.MakeID();

    MultiUpdate.push({
        "profileRevision": collection_book_profile.rvn || 0,
        "profileId": collection_book_profile.profileId || "collection_book_people0",
        "profileChangesBaseRevision": collection_book_profile.rvn || 0,
        "profileChanges": [],
        "profileCommandRevision": collection_book_profile.commandRevision || 0,
    })

    if (profile.items[req.body.itemId]) {
        profile.items[ID] = collection_book_profile.items[req.body.itemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": profile.items[ID]
        })

        delete collection_book_profile.items[req.body.itemId];
        MultiUpdate[0].profileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.itemId
        })

        StatChanged = true;
    }

    if (!profile.items[req.body.itemId]) {
        profile.items[req.body.itemId] = collection_book_profile.items[req.body.itemId];
        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": req.body.itemId,
            "item": profile.items[req.body.itemId]
        })

        delete collection_book_profile.items[req.body.itemId];
        MultiUpdate[0].profileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.itemId
        })

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        collection_book_profile.rvn += 1;
        collection_book_profile.commandRevision += 1;

        MultiUpdate[0].profileRevision = collection_book_profile.rvn || 0;
        MultiUpdate[0].profileCommandRevision = collection_book_profile.commandRevision || 0;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
        fs.writeFileSync(`./profiles/${collection_book_profile.profileId || "collection_book_people0"}.json`, JSON.stringify(collection_book_profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Claim collection book rewards STW
express.post("/fortnite/api/game/v2/profile/*/client/ClaimCollectionBookRewards", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.requiredXp) {
        profile.stats.attributes.collection_book.maxBookXpLevelAchieved += 1;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "collection_book",
            "value": profile.stats.attributes.collection_book
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Modify schematic perk STW
express.post("/fortnite/api/game/v2/profile/*/client/RespecAlteration", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId && req.body.alterationId) {
        if (!profile.items[req.body.targetItemId].attributes.alterations) {
            profile.items[req.body.targetItemId].attributes.alterations = ["","","","","",""];
        }

        profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot] = req.body.alterationId;
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "alterations",
            "attributeValue": profile.items[req.body.targetItemId].attributes.alterations
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Upgrade schematic perk STW
express.post("/fortnite/api/game/v2/profile/*/client/UpgradeAlteration", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.targetItemId) {
        if (profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].toLowerCase().includes("t04")) {
            profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot] = profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].replace(/t04/ig, "T05");
        }

        if (profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].toLowerCase().includes("t03")) {
            profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot] = profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].replace(/t03/ig, "T04");
        }

        if (profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].toLowerCase().includes("t02")) {
            profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot] = profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].replace(/t02/ig, "T03");
        }

        if (profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].toLowerCase().includes("t01")) {
            profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot] = profile.items[req.body.targetItemId].attributes.alterations[req.body.alterationSlot].replace(/t01/ig, "T02");
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.targetItemId,
            "attributeName": "alterations",
            "attributeValue": profile.items[req.body.targetItemId].attributes.alterations
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Reset research levels STW
express.post("/fortnite/api/game/v2/profile/*/client/RespecResearch", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (profile.stats.attributes.research_levels) {
        profile.stats.attributes.research_levels.technology = 0;
        profile.stats.attributes.research_levels.fortitude = 0;
        profile.stats.attributes.research_levels.offense = 0;
        profile.stats.attributes.research_levels.resistance = 0;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "research_levels",
            "value": profile.stats.attributes.research_levels
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Reset upgrade levels STW
express.post("/fortnite/api/game/v2/profile/*/client/RespecUpgrades", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    
    for (var key in profile.items) {
        if (profile.items[key].templateId.toLowerCase().startsWith("homebasenode:skilltree_")) {
            profile.items[key].quantity = 0;

            ApplyProfileChanges.push({
                "changeType": "itemQuantityChanged",
                "itemId": key,
                "quantity": profile.items[key].quantity
            })
        }
    }

    StatChanged = true;

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Upgrade research levels STW
express.post("/fortnite/api/game/v2/profile/*/client/PurchaseResearchStatUpgrade", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (profile.stats.attributes.research_levels && req.body.statId) {
        profile.stats.attributes.research_levels[req.body.statId] += 1;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "research_levels",
            "value": profile.stats.attributes.research_levels
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Upgrade levels STW
express.post("/fortnite/api/game/v2/profile/*/client/PurchaseOrUpgradeHomebaseNode", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    var CreateHomebaseNode = true;
    
    if (req.body.nodeId) {
        for (var key in profile.items) {
            if (profile.items[key].templateId.toLowerCase() == req.body.nodeId.toLowerCase()) {
                profile.items[key].quantity += 1;

                ApplyProfileChanges.push({
                    "changeType": "itemQuantityChanged",
                    "itemId": key,
                    "quantity": profile.items[key].quantity
                })

                CreateHomebaseNode = false;
            }
        }

        if (CreateHomebaseNode == true) {
            const ID = functions.MakeID();

            profile.items[ID] = {
                "templateId": req.body.nodeId,
                "attributes": {
                    "item_seen": false
                },
                "quantity": 1
            }

            ApplyProfileChanges.push({
                "changeType": "itemAdded",
                "itemId": ID,
                "item": profile.items[ID]
            })
        }
    }

    StatChanged = true;

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Refresh expeditions STW
express.post("/fortnite/api/game/v2/profile/*/client/RefreshExpeditions", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    var expeditionData = require("./../responses/Campaign/expeditionData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var ExpeditionSlots = [];
    var date = new Date().toISOString();

    // Check which quests that grant expedition slots are completed and add these slots to the list of available ones.
    for (var key in profile.items) {
        var templateId = profile.items[key].templateId.toLowerCase();
        if (expeditionData.questsUnlockingSlots.includes(templateId)) {
            if (profile.items[key].attributes.quest_state == "Claimed") {
                ExpeditionSlots = ExpeditionSlots.concat(expeditionData.slotsFromQuests[templateId]);
            }
        }
    }

    // Remove the expired expeditions.
    for (var key in profile.items) {
        if (profile.items[key].templateId.toLowerCase().startsWith("expedition:")) {
            var expiration_end_time = new Date(profile.items[key].attributes.expedition_expiration_end_time).toISOString();
            if (date > expiration_end_time && !profile.items[key].attributes.hasOwnProperty("expedition_start_time")) {
                delete profile.items[key];

                ApplyProfileChanges.push({
                    "changeType": "itemRemoved",
                    "itemId": key
                })

                StatChanged = true;
            } else { // If the expedition is still active, remove its slot from ExpeditionSlots list so the server doesn't make a new one for it.
                var index = ExpeditionSlots.indexOf(profile.items[key].attributes.expedition_slot_id);
                if (index !== -1) {
                    ExpeditionSlots.splice(index, 1)
                }
            }
        }
    }

    // Make new expeditions
    for (var i = 0; i < ExpeditionSlots.length; i++) {
        var slot = ExpeditionSlots[i];

        // 5% (could be different) chance of making a rare expedition
        var ExpeditionsToChoose = expeditionData.slots[slot];
        if (ExpeditionsToChoose.hasOwnProperty("rare") && Math.random() < 0.05) {
            ExpeditionsToChoose = ExpeditionsToChoose.rare;
        } else {
            ExpeditionsToChoose = ExpeditionsToChoose.normal;
        }

        var randomNumber = Math.floor(Math.random() * ExpeditionsToChoose.length);
        var ID = functions.MakeID();
        var templateId = ExpeditionsToChoose[randomNumber];

        var endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + expeditionData.attributes[templateId].expiration_duration_minutes);
        endDate = endDate.toISOString();

        var Item = {
            "templateId": templateId,
            "attributes": {
                "expedition_expiration_end_time": endDate,
                "expedition_criteria": [],
                "level": 1,
                "expedition_max_target_power": expeditionData.attributes[templateId].expedition_max_target_power,
                "expedition_min_target_power": expeditionData.attributes[templateId].expedition_min_target_power,
                "expedition_slot_id": slot,
                "expedition_expiration_start_time": date
            },
            "quantity": 1
        }

        for (var x = 0; x < 3; x++) {
            if (Math.random() < 0.2) { // 20% (could be different) chance of the expedition having a bonus criteria up to 3
                randomNumber = Math.floor(Math.random() * expeditionData.criteria.length);
                Item.attributes.expedition_criteria.push(expeditionData.criteria[randomNumber])
            }
        }

        profile.items[ID] = Item;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": Item
        })
        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Start an expedition STW
express.post("/fortnite/api/game/v2/profile/*/client/StartExpedition", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    const memory = functions.GetVersionInfo(req);
    var expeditionData = require("./../responses/Campaign/expeditionData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    
    var date = new Date().toISOString();

    if (req.body.expeditionId && req.body.squadId && req.body.itemIds && req.body.slotIndices) {
        var ExpeditionLevel = profile.items[req.body.expeditionId].attributes.expedition_max_target_power;
        var HeroLevels = expeditionData.heroLevels;
        if (memory.build < 13.20) { // The levels got changed a bit in v13.20+
            HeroLevels = HeroLevels.old;
        } else {
            HeroLevels = HeroLevels.new;
        }

        // Make a list with expedition heroes sorted by their power level
        var SortedHeroes = []
        for (var i = 0; i < req.body.itemIds.length; i++) {
            var hero = req.body.itemIds[i];
            for (var item in profile.items) {
                if (hero == item) {
                    var splitTemplateId = profile.items[item].templateId.split("_")
                    var rarity = splitTemplateId.slice(-2, -1)[0].toLowerCase();
                    var tier = splitTemplateId.slice(-1)[0].toLowerCase();
                    var level = profile.items[item].attributes.level;
                    var Hero = {
                        "itemGuid": hero,
                        "templateId": profile.items[item].templateId,
                        "class": splitTemplateId[1].toLowerCase(),
                        "rarity": rarity,
                        "tier": tier,
                        "level": level,
                        "powerLevel": HeroLevels[rarity][tier][level],
                        "bBoostedByCriteria": false
                    }
                    SortedHeroes.push(Hero)
                }
            }
        }
        SortedHeroes.sort((a, b) => b.powerLevel - a.powerLevel);

        // Check if any of the heroes meet any of the available criterias. If so, then boost their power level.
        if (profile.items[req.body.expeditionId].attributes.hasOwnProperty("expedition_criteria")) {
            var criteria = profile.items[req.body.expeditionId].attributes.expedition_criteria;
            for (var i = 0; i < criteria.length; i++) {
                criterion = criteria[i];

                for (var x = 0; x < SortedHeroes.length; x++) {
                    var bIsMatchingHero = true;
                    var requirements = expeditionData.criteriaRequirements[criterion].requirements;
                    if (requirements.class != SortedHeroes[x].class) {
                        bIsMatchingHero = false;
                    }
                    if (requirements.hasOwnProperty("rarity")) {
                        if (!requirements.rarity.includes(SortedHeroes[x].rarity)) {
                            bIsMatchingHero = false;
                        }
                    }

                    if (bIsMatchingHero == true && SortedHeroes[x].bBoostedByCriteria == false) {
                        SortedHeroes[x].powerLevel = SortedHeroes[x].powerLevel * expeditionData.criteriaRequirements[criterion].ModValue;
                        SortedHeroes[x].bBoostedByCriteria = true;
                        break;
                    }
                }
            }
        }

        // Calculate the expedition success chance
        var TotalPowerLevel = 0;
        for (var i = 0; i < SortedHeroes.length; i++) {
            TotalPowerLevel += SortedHeroes[i].powerLevel;
        }
        var ExpeditionSuccessChance = TotalPowerLevel / ExpeditionLevel;
        if (ExpeditionSuccessChance > 1) {
            ExpeditionSuccessChance = 1;
        }

        // Assign Squad ids and slots to selected heroes
        for (var i = 0; i < req.body.itemIds.length; i++) {
            var hero = req.body.itemIds[i];
            profile.items[hero].attributes.squad_id = req.body.squadId.toLowerCase();
            profile.items[hero].attributes.squad_slot_idx = req.body.slotIndices[i];

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": hero,
                "attributeName": "squad_id",
                "attributeValue": profile.items[hero].attributes.squad_id
            })
            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": hero,
                "attributeName": "squad_slot_idx",
                "attributeValue": profile.items[hero].attributes.squad_slot_idx
            })
        }

        // Calculate the expedition end date
        var endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + expeditionData.attributes[profile.items[req.body.expeditionId].templateId].expedition_duration_minutes);
        endDate = endDate.toISOString();

        profile.items[req.body.expeditionId].attributes.expedition_squad_id = req.body.squadId.toLowerCase();
        profile.items[req.body.expeditionId].attributes.expedition_success_chance = ExpeditionSuccessChance;
        profile.items[req.body.expeditionId].attributes.expedition_start_time = date;
        profile.items[req.body.expeditionId].attributes.expedition_end_time = endDate;

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_squad_id",
            "attributeValue": profile.items[req.body.expeditionId].attributes.expedition_squad_id
        })
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_success_chance",
            "attributeValue": profile.items[req.body.expeditionId].attributes.expedition_success_chance
        })
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_start_time",
            "attributeValue": profile.items[req.body.expeditionId].attributes.expedition_start_time
        })
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_end_time",
            "attributeValue": profile.items[req.body.expeditionId].attributes.expedition_end_time
        })

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Abandon an expedition STW
express.post("/fortnite/api/game/v2/profile/*/client/AbandonExpedition", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    var expeditionData = require("./../responses/Campaign/expeditionData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    
    var date = new Date().toISOString();

    if (req.body.expeditionId) {
        var squad_id = profile.items[req.body.expeditionId].attributes.expedition_squad_id;
        for (var item2 in profile.items) { // Remove the squad ids and slots from heroes
            if (profile.items[item2].attributes.hasOwnProperty("squad_id")) {
                if (profile.items[item2].attributes.squad_id == squad_id) {
                    profile.items[item2].attributes.squad_id = "";
                    profile.items[item2].attributes.squad_slot_idx = -1;
                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": item2,
                        "attributeName": "squad_id",
                        "attributeValue": profile.items[item2].attributes.squad_id
                    })
                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": item2,
                        "attributeName": "squad_slot_idx",
                        "attributeValue": profile.items[item2].attributes.squad_slot_idx
                    })
                }
            }
        }

        // Set the expedition back as available
        delete profile.items[req.body.expeditionId].attributes.expedition_squad_id
        delete profile.items[req.body.expeditionId].attributes.expedition_start_time
        delete profile.items[req.body.expeditionId].attributes.expedition_end_time
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_squad_id",
            "attributeValue": ""
        })
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_start_time",
            "attributeValue": null
        })
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.expeditionId,
            "attributeName": "expedition_end_time",
            "attributeValue": null
        })

        var expiration_end_time = new Date(profile.items[req.body.expeditionId].attributes.expedition_expiration_end_time).toISOString();
        if (date > expiration_end_time) {
            // Remove the abandoned expedition and make a new one to replace it
            var slot = profile.items[req.body.expeditionId].attributes.expedition_slot_id;
            delete profile.items[req.body.expeditionId]
            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": req.body.expeditionId
            })

            // 5% (could be different) chance of making a rare expedition
            var ExpeditionsToChoose = expeditionData.slots[slot];
            if (ExpeditionsToChoose.hasOwnProperty("rare") && Math.random() < 0.05) {
                ExpeditionsToChoose = ExpeditionsToChoose.rare;
            } else {
                ExpeditionsToChoose = ExpeditionsToChoose.normal;
            }

            var randomNumber = Math.floor(Math.random() * ExpeditionsToChoose.length);
            var ID = functions.MakeID();
            var templateId = ExpeditionsToChoose[randomNumber];

            var endDate = new Date(date);
            endDate.setMinutes(endDate.getMinutes() + expeditionData.attributes[templateId].expiration_duration_minutes);
            endDate = endDate.toISOString();

            var Item = {
                "templateId": templateId,
                "attributes": {
                    "expedition_expiration_end_time": endDate,
                    "expedition_criteria": [],
                    "level": 1,
                    "expedition_max_target_power": expeditionData.attributes[templateId].expedition_max_target_power,
                    "expedition_min_target_power": expeditionData.attributes[templateId].expedition_min_target_power,
                    "expedition_slot_id": slot,
                    "expedition_expiration_start_time": date
                },
                "quantity": 1
            }

            for (var x = 0; x < 3; x++) {
                if (Math.random() < 0.2) { // 20% (could be different) chance of the expedition having a bonus criteria up to 3
                    randomNumber = Math.floor(Math.random() * expeditionData.criteria.length);
                    Item.attributes.expedition_criteria.push(expeditionData.criteria[randomNumber])
                }
            }

            profile.items[ID] = Item;

            ApplyProfileChanges.push({
                "changeType": "itemAdded",
                "itemId": ID,
                "item": Item
            })
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Collect a finished expedition STW
express.post("/fortnite/api/game/v2/profile/*/client/CollectExpedition", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    var expeditionData = require("./../responses/Campaign/expeditionData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var OtherProfiles = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;
    
    var date = new Date().toISOString();

    if (req.body.expeditionId) {
        Notifications.push({
            "type": "expeditionResult",
            "primary": true,
            "client_request_id": "",
            "bExpeditionSucceeded" : false
        })

        // Determine if the expedition was successful
        if (Math.random() < profile.items[req.body.expeditionId].attributes.expedition_success_chance) {
            Notifications[0].bExpeditionSucceeded = true;
            Notifications[0].expeditionRewards = [];

            // If so, then grant the rewards
            for (var i = 0; i < expeditionData.rewards.length; i++) {
                var randomNumber = Math.floor(Math.random() * expeditionData.rewards[i].length);
                var ID = functions.MakeID();
                var templateId = expeditionData.rewards[i][randomNumber].templateId;
                var itemProfile = expeditionData.rewards[i][randomNumber].itemProfile;

                var minQ = expeditionData.rewards[i][randomNumber].minQuantity;
                var maxQ = expeditionData.rewards[i][randomNumber].maxQuantity;
                var quantity = Math.floor(Math.random() * (maxQ - minQ + 1)) + minQ;

                var Item = {
                    "templateId": templateId,
                    "attributes": {
                        "loadedAmmo": 0,
                        "inventory_overflow_date": false,
                        "level": 0,
                        "alterationDefinitions": [],
                        "durability": 1,
                        "itemSource": ""
                    },
                    "quantity": quantity
                }

                Notifications[0].expeditionRewards.push({
                    "itemType": templateId,
                    "itemGuid": ID,
                    "itemProfile": itemProfile,
                    "quantity": quantity
                })

                if (itemProfile == req.query.profileId) {
                    profile.items[ID] = Item;
                    ApplyProfileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": Item
                    })
                } else {
                    var k = -1; // index of item profile in MultiUpdate
                    for (var x = 0; x < MultiUpdate.length; x++) {
                        if (MultiUpdate[x].profileId == itemProfile) {
                            k = x;
                        }
                    }
                    if (k == -1) {
                        OtherProfiles.push(require(`./../profiles/${itemProfile}.json`))
                        k = MultiUpdate.length;
                        MultiUpdate.push({
                            "profileRevision": OtherProfiles[k].rvn || 0,
                            "profileId": OtherProfiles[k].profileId,
                            "profileChangesBaseRevision": OtherProfiles[k].rvn || 0,
                            "profileChanges": [],
                            "profileCommandRevision": OtherProfiles[k].commandRevision || 0,
                        })
                    }

                    OtherProfiles[k].items[ID] = Item;
                    MultiUpdate[k].profileChanges.push({
                        "changeType": "itemAdded",
                        "itemId": ID,
                        "item": Item
                    })
                }
            }
        }

        var squad_id = profile.items[req.body.expeditionId].attributes.expedition_squad_id;
        for (var item2 in profile.items) { // Remove the squad ids and slots from heroes
            if (profile.items[item2].attributes.hasOwnProperty("squad_id")) {
                if (profile.items[item2].attributes.squad_id == squad_id) {
                    profile.items[item2].attributes.squad_id = "";
                    profile.items[item2].attributes.squad_slot_idx = -1;
                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": item2,
                        "attributeName": "squad_id",
                        "attributeValue": profile.items[item2].attributes.squad_id
                    })
                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": item2,
                        "attributeName": "squad_slot_idx",
                        "attributeValue": profile.items[item2].attributes.squad_slot_idx
                    })
                }
            }
        }

        // Make a new expedition to replace the finished one
        var slot = profile.items[req.body.expeditionId].attributes.expedition_slot_id;
        delete profile.items[req.body.expeditionId]
        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.expeditionId
        })

        // 5% (could be different) chance of making a rare expedition
        var ExpeditionsToChoose = expeditionData.slots[slot];
        if (ExpeditionsToChoose.hasOwnProperty("rare") && Math.random() < 0.05) {
            ExpeditionsToChoose = ExpeditionsToChoose.rare;
        } else {
            ExpeditionsToChoose = ExpeditionsToChoose.normal;
        }

        var randomNumber = Math.floor(Math.random() * ExpeditionsToChoose.length);
        var ID = functions.MakeID();
        var templateId = ExpeditionsToChoose[randomNumber];

        var endDate = new Date(date);
        endDate.setMinutes(endDate.getMinutes() + expeditionData.attributes[templateId].expiration_duration_minutes);
        endDate = endDate.toISOString();

        var Item = {
            "templateId": templateId,
            "attributes": {
                "expedition_expiration_end_time": endDate,
                "expedition_criteria": [],
                "level": 1,
                "expedition_max_target_power": expeditionData.attributes[templateId].expedition_max_target_power,
                "expedition_min_target_power": expeditionData.attributes[templateId].expedition_min_target_power,
                "expedition_slot_id": slot,
                "expedition_expiration_start_time": date
            },
            "quantity": 1
        }

        for (var x = 0; x < 3; x++) {
            if (Math.random() < 0.2) { // 20% (could be different) chance of the expedition having a bonus criteria up to 3
                randomNumber = Math.floor(Math.random() * expeditionData.criteria.length);
                Item.attributes.expedition_criteria.push(expeditionData.criteria[randomNumber])
            }
        }

        profile.items[ID] = Item;

        ApplyProfileChanges.push({
            "changeType": "itemAdded",
            "itemId": ID,
            "item": Item
        })

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));

        for (var i = 0; i < OtherProfiles.length; i++) {
            OtherProfiles[i].rvn += 1;
            OtherProfiles[i].commandRevision += 1;

            MultiUpdate[i].profileRevision += 1;
            MultiUpdate[i].profileCommandRevision += 1;

            fs.writeFileSync(`./profiles/${OtherProfiles[i].profileId || "campaign"}.json`, JSON.stringify(OtherProfiles[i], null, 2));
        }
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Set active hero loadout STW
express.post("/fortnite/api/game/v2/profile/*/client/SetActiveHeroLoadout", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.selectedLoadout) {
        profile.stats.attributes.selected_hero_loadout = req.body.selectedLoadout;

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "selected_hero_loadout",
            "value": profile.stats.attributes.selected_hero_loadout
        })

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Activate consumable STW
express.post("/fortnite/api/game/v2/profile/*/client/ActivateConsumable", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var XPBoost;

    if (req.body.targetItemId) {
        profile.items[req.body.targetItemId].quantity -= 1;

        for (var key in profile.items) {
            if (profile.items[key].templateId == "Token:xpboost") {
                var randomNumber = Math.floor(Math.random() * 1250000);
                if (randomNumber < 1000000) {
                    randomNumber += 1000000
                }

                profile.items[key].quantity += randomNumber;

                XPBoost = key;
            }
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        ApplyProfileChanges.push({
            "changeType": "itemQuantityChanged",
            "itemId": req.body.targetItemId,
            "quantity": profile.items[req.body.targetItemId].quantity
        })

        if (XPBoost) {
            ApplyProfileChanges.push({
                "changeType": "itemQuantityChanged",
                "itemId": XPBoost,
                "quantity": profile.items[XPBoost].quantity
            })
        }

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Unassign all squads STW
express.post("/fortnite/api/game/v2/profile/*/client/UnassignAllSquads", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.squadIds) {
        for (var i in req.body.squadIds) {
            let id = req.body.squadIds[i];

            for (var key in profile.items) {
                if (profile.items[key].attributes.hasOwnProperty('squad_id')) {
                    if (profile.items[key].attributes.squad_id.toLowerCase() == id.toLowerCase()) {
                        profile.items[key].attributes.squad_id = "";

                        ApplyProfileChanges.push({
                            "changeType": "itemAttrChanged",
                            "itemId": key,
                            "attributeName": "squad_id",
                            "attributeValue": profile.items[key].attributes.squad_id
                        })
                    }
                }
            }
        }

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Open llama STW
express.post("/fortnite/api/game/v2/profile/*/client/OpenCardPack", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    const cardpackData = require("./../responses/Campaign/cardPackData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.cardPackItemId) {
        Notifications.push({
            "type": "cardPackResult",
            "primary": true,
            "lootGranted": {
                "tierGroupName": profile.items[req.body.cardPackItemId].templateId.split(":")[1],
                "items": []
            },
            "displayLevel": 0
        })

        if (cardpackData.choiceCardPacks.includes(profile.items[req.body.cardPackItemId].templateId)) {
            var ChosenItem = profile.items[req.body.cardPackItemId].attributes.options[req.body.selectionIdx];
            var Item = {"templateId":ChosenItem.itemType,"attributes":ChosenItem.attributes,"quantity":ChosenItem.quantity};
            const ID = functions.MakeID();

            profile.items[ID] = Item;

            ApplyProfileChanges.push({
                "changeType": "itemAdded",
                "itemId": ID,
                "item": Item
            })

            Notifications[0].lootGranted.items.push({
                "itemType": Item.templateId,
                "itemGuid": ID,
                "itemProfile": req.query.profileId,
                "attributes": Item.attributes,
                "quantity": Item.quantity
            })
        } else {
            for (var i = 0; i < 10; i++) {
                const ID = functions.MakeID();
                var ItemIDS = cardpackData.default;
                var randomNumber = Math.floor(Math.random() * ItemIDS.length);
                var Item = {"templateId":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                    Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                }
    
                if (Math.random() < 0.1) { // 10% (could be dfferent) chance of getting a choice CardPack.
                    var CPTemplateId = cardpackData.choiceCardPacks[Math.floor(Math.random() * cardpackData.choiceCardPacks.length)];
                    var CPItem = {"templateId":CPTemplateId,"attributes":{"level":1,"pack_source":"Store","options":[]},"quantity":1}
                    ItemIDS = cardpackData[CPTemplateId.toLowerCase()] || cardpackData.default;

                    for (var x = 0; x < 2; x++) {
                        randomNumber = Math.floor(Math.random() * ItemIDS.length);
                        Item = {"itemType":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                        if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                            Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                        }
                        ItemIDS.splice(ItemIDS.indexOf(ItemIDS[randomNumber]), 1);
                        CPItem.attributes.options.push(Item);
                    }
                    Item = CPItem;
                }
    
                profile.items[ID] = Item;
    
                ApplyProfileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": ID,
                    "item": Item
                })
    
                Notifications[0].lootGranted.items.push({
                    "itemType": ItemIDS[randomNumber],
                    "itemGuid": ID,
                    "itemProfile": req.query.profileId,
                    "attributes": Item.attributes,
                    "quantity": 1
                })
            }
        }

        if (profile.items[req.body.cardPackItemId].quantity <= 1) {
            delete profile.items[req.body.cardPackItemId]

            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": req.body.cardPackItemId
            })
        }

        try {
            profile.items[req.body.cardPackItemId].quantity -= 1;

            ApplyProfileChanges.push({
                "changeType": "itemQuantityChanged",
                "itemId": req.body.cardPackItemId,
                "quantity": profile.items[req.body.cardPackItemId].quantity
            })
        } catch (err) {}

        StatChanged = true;
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    // if (QueryRevision != BaseRevision) {
    //     ApplyProfileChanges = [{
    //         "changeType": "fullProfileUpdate",
    //         "profile": profile
    //     }];
    // }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Add items to StW X-Ray Llamas
express.post("/fortnite/api/game/v2/profile/*/client/PopulatePrerolledOffers", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "campaign"}.json`);
    const cardpackData = require("./../responses/Campaign/cardPackData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    var date = new Date().toISOString();

    for (var key in profile.items) {
        if (profile.items[key].templateId.toLowerCase() == "prerolldata:preroll_basic") {
            if (date > profile.items[key].attributes.expiration) {
                profile.items[key].attributes.items = [];

                for (var i = 0; i < 10; i++) {
                    var ItemIDS = cardpackData.default;
                    var randomNumber = Math.floor(Math.random() * ItemIDS.length);
                    var Item = {"itemType":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                    if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                        Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                    }
        
                    if (Math.random() < 0.1) { // 10% (could be dfferent) chance of getting a choice Cardpack.
                        var CPTemplateId = cardpackData.choiceCardPacks[Math.floor(Math.random() * cardpackData.choiceCardPacks.length)];
                        var CPItem = {"itemType":CPTemplateId,"attributes":{"level":1,"pack_source":"Store","options":[]},"quantity":1}
                        ItemIDS = cardpackData[CPTemplateId.toLowerCase()] || cardpackData.default;

                        for (var x = 0; x < 2; x++) {
                            randomNumber = Math.floor(Math.random() * ItemIDS.length);
                            Item = {"itemType":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                            if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                                Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                            }
                            ItemIDS.splice(ItemIDS.indexOf(ItemIDS[randomNumber]), 1);
                            CPItem.attributes.options.push(Item);
                        }
                        Item = CPItem;
                    }

                    profile.items[key].attributes.items.push(Item)
                }

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": key,
                    "attributeName": "items",
                    "attributeValue": profile.items[key].attributes.items
                })

                profile.items[key].attributes.expiration = new Date().toISOString().split("T")[0] + "T23:59:59.999Z";

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": key,
                    "attributeName": "expiration",
                    "attributeValue": profile.items[key].attributes.expiration
                })

                StatChanged = true;
            }
        }
    }

    if (StatChanged == true) {
        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "campaign"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "campaign",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});

// Purchase item
express.post("/fortnite/api/game/v2/profile/*/client/PurchaseCatalogEntry", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "profile0"}.json`);
    const campaign = require("./../profiles/campaign.json");
    const athena = require("./../profiles/athena.json");
    const cardpackData = require("./../responses/Campaign/cardPackData.json");

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var MultiUpdate = [];
    var Notifications = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var PurchasedLlama = false;
    var AthenaModified = false;
    var ItemExists = false;

    if (req.body.offerId && profile.profileId == "profile0" && PurchasedLlama == false) {
        catalog.storefronts.forEach(function(value, a) {
            if (value.name.toLowerCase().startsWith("cardpack")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        var Quantity = 0;
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            Quantity = req.body.purchaseQuantity || 1;

                            const Item = {
                                "templateId": value.templateId,
                                "attributes": {
                                    "is_loot_tier_overridden": false,
                                    "max_level_bonus": 0,
                                    "level": 1391,
                                    "pack_source": "Schedule",
                                    "item_seen": false,
                                    "xp": 0,
                                    "favorite": false,
                                    "override_loot_tier": 0
                                },
                                "quantity": 1
                            };

                            for (var i = 0; i < Quantity; i++) {
                                var ID = functions.MakeID();

                                profile.items[ID] = Item;

                                ApplyProfileChanges.push({
                                    "changeType": "itemAdded",
                                    "itemId": ID,
                                    "item": profile.items[ID]
                                })
                            }
                        })
                        // Vbucks spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                            for (var key in profile.items) {
                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                        profile.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * Quantity;
                                                                        
                                        ApplyProfileChanges.push({
                                            "changeType": "itemQuantityChanged",
                                            "itemId": key,
                                            "quantity": profile.items[key].quantity
                                        })
                                                
                                        profile.rvn += 1;
                                        profile.commandRevision += 1;
                                                
                                        break;
                                    }
                                }
                            }
                        }
                    }
                })
            }

            // Battle pass
            if (value.name.startsWith("BRSeason")) {
                if (!Number.isNaN(Number(value.name.split("BRSeason")[1]))) {
                    var offer = value.catalogEntries.find(i => i.offerId == req.body.offerId);

                    if (offer) {
                        if (MultiUpdate.length == 0) {
                            MultiUpdate.push({
                                "profileRevision": athena.rvn || 0,
                                "profileId": "athena",
                                "profileChangesBaseRevision": athena.rvn || 0,
                                "profileChanges": [],
                                "profileCommandRevision": athena.commandRevision || 0,
                            })
                        }

                        var Season = value.name.split("BR")[1];
                        var BattlePass = require(`./../responses/Athena/BattlePass/${Season}.json`);

                        if (BattlePass) {
                            var SeasonData = require("./../responses/Athena/SeasonData.json");

                            if (BattlePass.battlePassOfferId == offer.offerId || BattlePass.battleBundleOfferId == offer.offerId) {
                                var lootList = [];
                                var EndingTier = SeasonData[Season].battlePassTier;
                                SeasonData[Season].battlePassPurchased = true;

                                if (BattlePass.battleBundleOfferId == offer.offerId) {
                                    SeasonData[Season].battlePassTier += 25;
                                    if (SeasonData[Season].battlePassTier > 100) SeasonData[Season].battlePassTier = 100;
                                    EndingTier = SeasonData[Season].battlePassTier;
                                }

                                for (var i = 0; i < EndingTier; i++) {
                                    var FreeTier = BattlePass.freeRewards[i] || {};
                                    var PaidTier = BattlePass.paidRewards[i] || {};

                                    for (var item in FreeTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += FreeTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":FreeTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": FreeTier[item]
                                        })
                                    }

                                    for (var item in PaidTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += PaidTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":PaidTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": PaidTier[item]
                                        })
                                    }
                                }

                                var GiftBoxID = functions.MakeID();
                                var GiftBox = {"templateId":Number(Season.split("Season")[1]) <= 4 ? "GiftBox:gb_battlepass" : "GiftBox:gb_battlepasspurchased","attributes":{"max_level_bonus":0,"fromAccountId":"","lootList":lootList}}

                                if (Number(Season.split("Season")[1]) > 2) {
                                    profile.items[GiftBoxID] = GiftBox;
                                    
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": GiftBoxID,
                                        "item": GiftBox
                                    })
                                }

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_purchased",
                                    "value": SeasonData[Season].battlePassPurchased
                                })

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_level",
                                    "value": SeasonData[Season].battlePassTier
                                })

                                AthenaModified = true;
                            }

                            if (BattlePass.tierOfferId == offer.offerId) {
                                var lootList = [];
                                var StartingTier = SeasonData[Season].battlePassTier;
                                var EndingTier;
                                SeasonData[Season].battlePassTier += req.body.purchaseQuantity || 1;
                                EndingTier = SeasonData[Season].battlePassTier;

                                for (var i = StartingTier; i < EndingTier; i++) {
                                    var FreeTier = BattlePass.freeRewards[i] || {};
                                    var PaidTier = BattlePass.paidRewards[i] || {};

                                    for (var item in FreeTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += FreeTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":FreeTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": FreeTier[item]
                                        })
                                    }

                                    for (var item in PaidTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += PaidTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":PaidTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": PaidTier[item]
                                        })
                                    }
                                }

                                var GiftBoxID = functions.MakeID();
                                var GiftBox = {"templateId":"GiftBox:gb_battlepass","attributes":{"max_level_bonus":0,"fromAccountId":"","lootList":lootList}}

                                if (Number(Season.split("Season")[1]) > 2) {
                                    profile.items[GiftBoxID] = GiftBox;
                                    
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": GiftBoxID,
                                        "item": GiftBox
                                    })
                                }

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_level",
                                    "value": SeasonData[Season].battlePassTier
                                })

                                AthenaModified = true;
                            }

                            fs.writeFileSync("./responses/Athena/SeasonData.json", JSON.stringify(SeasonData, null, 2));
                        }
                    }
                }
            }

            if (value.name.startsWith("BR")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            const ID = functions.MakeID();

                            for (var key in athena.items) {
                                if (value.templateId.toLowerCase() == athena.items[key].templateId.toLowerCase()) {
                                    ItemExists = true;
                                }
                            }

                            if (ItemExists == false) {
                                if (MultiUpdate.length == 0) {
                                    MultiUpdate.push({
                                        "profileRevision": athena.rvn || 0,
                                        "profileId": "athena",
                                        "profileChangesBaseRevision": athena.rvn || 0,
                                        "profileChanges": [],
                                        "profileCommandRevision": athena.commandRevision || 0,
                                    })
                                }

                                if (Notifications.length == 0) {
                                    Notifications.push({
                                        "type": "CatalogPurchase",
                                        "primary": true,
                                        "lootResult": {
                                            "items": []
                                        }
                                    })
                                }

                                const Item = {
                                    "templateId": value.templateId,
                                    "attributes": {
                                        "max_level_bonus": 0,
                                        "level": 1,
                                        "item_seen": false,
                                        "xp": 0,
                                        "variants": [],
                                        "favorite": false
                                    },
                                    "quantity": 1
                                };

                                athena.items[ID] = Item;

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "itemAdded",
                                    "itemId": ID,
                                    "item": athena.items[ID]
                                })

                                Notifications[0].lootResult.items.push({
                                    "itemType": value.templateId,
                                    "itemGuid": ID,
                                    "itemProfile": "athena",
                                    "quantity": value.quantity
                                })

                                AthenaModified = true;
                            }

                            ItemExists = false;
                        })
                        // Vbucks spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                            for (var key in profile.items) {
                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                        profile.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * req.body.purchaseQuantity || 1;
                        
                                        ApplyProfileChanges.push({
                                            "changeType": "itemQuantityChanged",
                                            "itemId": key,
                                            "quantity": profile.items[key].quantity
                                        })

                                        profile.rvn += 1;
                                        profile.commandRevision += 1;

                                        break;
                                    }
                                }
                            }
                        }
                    }
                })
            }

            if (value.name.startsWith("STW")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            const ID = functions.MakeID();

                            if (Notifications.length == 0) {
                                Notifications.push({
                                    "type": "CatalogPurchase",
                                    "primary": true,
                                    "lootResult": {
                                        "items": []
                                    }
                                })
                            }

                            var Item = {"templateId": value.templateId, "attributes": {"legacy_alterations": [], "max_level_bonus": 0, "level": 1, "refund_legacy_item": false, "item_seen": false, "alterations": ["", "", "", "", "", ""], "xp": 0, "refundable": false, "alteration_base_rarities": [], "favorite": false}, "quantity": req.body.purchaseQuantity * value.quantity || 1};

                            if (Item.templateId.toLowerCase().startsWith("worker:")) {
                                Item.attributes = functions.MakeSurvivorAttributes(Item.templateId);
                            }

                            profile.items[ID] = Item;

                            ApplyProfileChanges.push({
                                "changeType": "itemAdded",
                                "itemId": ID,
                                "item": Item
                            })

                            Notifications[0].lootResult.items.push({
                                "itemType": value.templateId,
                                "itemGuid": ID,
                                "itemProfile": "profile0",
                                "quantity": req.body.purchaseQuantity * value.quantity || 1
                            })
                        })
                        // STW currency spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "gameitem") {
                            for (var key in profile.items) {
                                if (profile.items[key].templateId.toLowerCase() == catalog.storefronts[a].catalogEntries[b].prices[0].currencySubType.toLowerCase()) {
                                    profile.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * req.body.purchaseQuantity || 1;
                                            
                                    ApplyProfileChanges.push({
                                        "changeType": "itemQuantityChanged",
                                        "itemId": key,
                                        "quantity": profile.items[key].quantity
                                    })
                    
                                    break;
                                }
                            }
                        }

                        profile.rvn += 1;
                        profile.commandRevision += 1;
                    }
                })
            }
        })

        PurchasedLlama = true;

        if (AthenaModified == true) {
            athena.rvn += 1;
            athena.commandRevision += 1;

            if (MultiUpdate[0]) {
                MultiUpdate[0].profileRevision = athena.rvn || 0;
                MultiUpdate[0].profileCommandRevision = athena.commandRevision || 0;
            }

            fs.writeFileSync("./profiles/athena.json", JSON.stringify(athena, null, 2));
            fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
        }

        if (AthenaModified == false) {
            profile.rvn += 1;
            profile.commandRevision += 1;

            fs.writeFileSync(`./profiles/${req.query.profileId || "profile0"}.json`, JSON.stringify(profile, null, 2));
        }
    }

    if (req.body.offerId && profile.profileId == "common_core") {
        catalog.storefronts.forEach(function(value, a) {
            if (value.name.toLowerCase().startsWith("cardpack")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        var Quantity = 0;
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            const memory = functions.GetVersionInfo(req);

                            if (4 >= memory.season && PurchasedLlama == false) {
                                if (MultiUpdate.length == 0) {
                                    MultiUpdate.push({
                                        "profileRevision": campaign.rvn || 0,
                                        "profileId": "campaign",
                                        "profileChangesBaseRevision": campaign.rvn || 0,
                                        "profileChanges": [],
                                        "profileCommandRevision": campaign.commandRevision || 0,
                                    })
                                }

                                Quantity = req.body.purchaseQuantity || 1;

                                const Item = {
                                    "templateId": value.templateId,
                                    "attributes": {
                                        "is_loot_tier_overridden": false,
                                        "max_level_bonus": 0,
                                        "level": 1391,
                                        "pack_source": "Schedule",
                                        "item_seen": false,
                                        "xp": 0,
                                        "favorite": false,
                                        "override_loot_tier": 0
                                    },
                                    "quantity": 1
                                };

                                for (var i = 0; i < Quantity; i++) {
                                    var ID = functions.MakeID();
    
                                    campaign.items[ID] = Item

                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ID,
                                        "item": campaign.items[ID]
                                    })
                                }

                                PurchasedLlama = true;
                            }

                            if (memory.build >= 5 && memory.build <= 7.20 && PurchasedLlama == false) {
                                if (MultiUpdate.length == 0) {
                                    MultiUpdate.push({
                                        "profileRevision": campaign.rvn || 0,
                                        "profileId": "campaign",
                                        "profileChangesBaseRevision": campaign.rvn || 0,
                                        "profileChanges": [],
                                        "profileCommandRevision": campaign.commandRevision || 0,
                                    })
                                }

                                Quantity = req.body.purchaseQuantity || 1;

                                const Item = {
                                    "templateId": value.templateId,
                                    "attributes": {
                                        "is_loot_tier_overridden": false,
                                        "max_level_bonus": 0,
                                        "level": 1391,
                                        "pack_source": "Schedule",
                                        "item_seen": false,
                                        "xp": 0,
                                        "favorite": false,
                                        "override_loot_tier": 0
                                    },
                                    "quantity": 1
                                };

                                for (var i = 0; i < Quantity; i++) {
                                    var ID = functions.MakeID();
    
                                    campaign.items[ID] = Item

                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ID,
                                        "item": campaign.items[ID]
                                    })
                                }

                                Notifications.push({
                                    "type": "cardPackResult",
                                    "primary": true,
                                    "lootGranted": {
                                        "tierGroupName": "",
                                        "items": []
                                    },
                                    "displayLevel": 0
                                })

                                PurchasedLlama = true;
                            }

                            if (6 < memory.season && PurchasedLlama == false) {
                                if (MultiUpdate.length == 0) {
                                    MultiUpdate.push({
                                        "profileRevision": campaign.rvn || 0,
                                        "profileId": "campaign",
                                        "profileChangesBaseRevision": campaign.rvn || 0,
                                        "profileChanges": [],
                                        "profileCommandRevision": campaign.commandRevision || 0,
                                    })
                                }

                                Quantity = req.body.purchaseQuantity || 1;
                                var LlamaItemIDS = [];

                                var Item = {
                                    "templateId": value.templateId,
                                    "attributes": {
                                        "is_loot_tier_overridden": false,
                                        "max_level_bonus": 0,
                                        "level": 1391,
                                        "pack_source": "Schedule",
                                        "item_seen": false,
                                        "xp": 0,
                                        "favorite": false,
                                        "override_loot_tier": 0
                                    },
                                    "quantity": 1
                                };

                                for (var i = 0; i < Quantity; i++) {
                                    var ID = functions.MakeID();
    
                                    campaign.items[ID] = Item

                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": ID,
                                        "item": campaign.items[ID]
                                    })

                                    LlamaItemIDS.push(ID);
                                }

                                Notifications.push({
                                    "type": "CatalogPurchase",
                                    "primary": true,
                                    "lootResult": {
                                        "items": []
                                    }
                                })

                                if (req.body.currencySubType.toLowerCase() != "accountresource:voucher_basicpack") {
                                    for (var x = 0; x < Quantity; x++) {
                                        for (var key in campaign.items) {
                                            if (campaign.items[key].templateId.toLowerCase() == "prerolldata:preroll_basic") {
                                                if (campaign.items[key].attributes.offerId == req.body.offerId) {
                                                    for (var item in campaign.items[key].attributes.items) {
                                                        const id = functions.MakeID();
                                                        var Item = {"templateId":campaign.items[key].attributes.items[item].itemType,"attributes":campaign.items[key].attributes.items[item].attributes,"quantity":campaign.items[key].attributes.items[item].quantity};
                
                                                        campaign.items[id] = Item;

                                                        MultiUpdate[0].profileChanges.push({
                                                            "changeType": "itemAdded",
                                                            "itemId": id,
                                                            "item": Item
                                                        })

                                                        Notifications[0].lootResult.items.push({
                                                            "itemType": campaign.items[key].attributes.items[item].itemType,
                                                            "itemGuid": id,
                                                            "itemProfile": "campaign",
                                                            "attributes": Item.attributes,
                                                            "quantity": 1
                                                        })
                                                    }

                                                    campaign.items[key].attributes.items = [];

                                                    for (var i = 0; i < 10; i++) {
                                                        var ItemIDS = cardpackData.default;
                                                        var randomNumber = Math.floor(Math.random() * ItemIDS.length);
                                                        var Item = {"itemType":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                                                        if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                                                            Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                                                        }
                                            
                                                        if (Math.random() < 0.1) { // 10% (could be dfferent) chance of getting a choice Cardpack.
                                                            var CPTemplateId = cardpackData.choiceCardPacks[Math.floor(Math.random() * cardpackData.choiceCardPacks.length)];
                                                            var CPItem = {"itemType":CPTemplateId,"attributes":{"level":1,"pack_source":"Store","options":[]},"quantity":1}
                                                            ItemIDS = cardpackData[CPTemplateId.toLowerCase()] || cardpackData.default;

                                                            for (var x = 0; x < 2; x++) {
                                                                randomNumber = Math.floor(Math.random() * ItemIDS.length);
                                                                Item = {"itemType":ItemIDS[randomNumber],"attributes":{"legacy_alterations":[],"max_level_bonus":0,"level":1,"refund_legacy_item":false,"item_seen":false,"alterations":["","","","","",""],"xp":0,"refundable":false,"alteration_base_rarities":[],"favorite":false},"quantity":1};
                                                                if (ItemIDS[randomNumber].toLowerCase().startsWith("worker:")) {
                                                                    Item.attributes = functions.MakeSurvivorAttributes(ItemIDS[randomNumber]);
                                                                }
                                                                ItemIDS.splice(ItemIDS.indexOf(ItemIDS[randomNumber]), 1);
                                                                CPItem.attributes.options.push(Item);
                                                            }
                                                            Item = CPItem;
                                                        }

                                                        campaign.items[key].attributes.items.push(Item)
                                                    }

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "items",
                                                        "attributeValue": campaign.items[key].attributes.items
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }

                                try {
                                    if (req.body.currencySubType.toLowerCase() != "accountresource:voucher_basicpack") {
                                        for (var i in LlamaItemIDS) {
                                            var id = LlamaItemIDS[i];

                                            delete campaign.items[id];
                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "itemRemoved",
                                                "itemId": id
                                            })
                                        }
                                    }
                                } catch (err) {}

                                PurchasedLlama = true;
                            }
                        })
                        // Vbucks spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                            for (var key in profile.items) {
                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                        profile.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * Quantity;
                                                
                                        ApplyProfileChanges.push({
                                            "changeType": "itemQuantityChanged",
                                            "itemId": key,
                                            "quantity": profile.items[key].quantity
                                        })
                        
                                        profile.rvn += 1;
                                        profile.commandRevision += 1;
                        
                                        break;
                                    }
                                }
                            }
                        }
                    }
                })
            }

            // Battle pass
            if (value.name.startsWith("BRSeason")) {
                if (!Number.isNaN(Number(value.name.split("BRSeason")[1]))) {
                    var offer = value.catalogEntries.find(i => i.offerId == req.body.offerId);

                    if (offer) {
                        if (MultiUpdate.length == 0) {
                            MultiUpdate.push({
                                "profileRevision": athena.rvn || 0,
                                "profileId": "athena",
                                "profileChangesBaseRevision": athena.rvn || 0,
                                "profileChanges": [],
                                "profileCommandRevision": athena.commandRevision || 0,
                            })
                        }

                        var Season = value.name.split("BR")[1];
                        var BattlePass = require(`./../responses/Athena/BattlePass/${Season}.json`);

                        if (BattlePass) {
                            var SeasonData = require("./../responses/Athena/SeasonData.json");

                            if (BattlePass.battlePassOfferId == offer.offerId || BattlePass.battleBundleOfferId == offer.offerId) {
                                var lootList = [];
                                var EndingTier = SeasonData[Season].battlePassTier;
                                SeasonData[Season].battlePassPurchased = true;

                                if (BattlePass.battleBundleOfferId == offer.offerId) {
                                    SeasonData[Season].battlePassTier += 25;
                                    if (SeasonData[Season].battlePassTier > 100) SeasonData[Season].battlePassTier = 100;
                                    EndingTier = SeasonData[Season].battlePassTier;
                                }

                                for (var i = 0; i < EndingTier; i++) {
                                    var FreeTier = BattlePass.freeRewards[i] || {};
                                    var PaidTier = BattlePass.paidRewards[i] || {};

                                    for (var item in FreeTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += FreeTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":FreeTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": FreeTier[item]
                                        })
                                    }

                                    for (var item in PaidTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += PaidTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":PaidTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": PaidTier[item]
                                        })
                                    }
                                }

                                var GiftBoxID = functions.MakeID();
                                var GiftBox = {"templateId":Number(Season.split("Season")[1]) <= 4 ? "GiftBox:gb_battlepass" : "GiftBox:gb_battlepasspurchased","attributes":{"max_level_bonus":0,"fromAccountId":"","lootList":lootList}}

                                if (Number(Season.split("Season")[1]) > 2) {
                                    profile.items[GiftBoxID] = GiftBox;
                                    
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": GiftBoxID,
                                        "item": GiftBox
                                    })
                                }

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_purchased",
                                    "value": SeasonData[Season].battlePassPurchased
                                })

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_level",
                                    "value": SeasonData[Season].battlePassTier
                                })

                                AthenaModified = true;
                            }

                            if (BattlePass.tierOfferId == offer.offerId) {
                                var lootList = [];
                                var StartingTier = SeasonData[Season].battlePassTier;
                                var EndingTier;
                                SeasonData[Season].battlePassTier += req.body.purchaseQuantity || 1;
                                EndingTier = SeasonData[Season].battlePassTier;

                                for (var i = StartingTier; i < EndingTier; i++) {
                                    var FreeTier = BattlePass.freeRewards[i] || {};
                                    var PaidTier = BattlePass.paidRewards[i] || {};

                                    for (var item in FreeTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += FreeTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += FreeTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":FreeTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": FreeTier[item]
                                        })
                                    }

                                    for (var item in PaidTier) {
                                        if (item.toLowerCase() == "token:athenaseasonxpboost") {
                                            SeasonData[Season].battlePassXPBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_match_boost",
                                                "value": SeasonData[Season].battlePassXPBoost
                                            })
                                        }

                                        if (item.toLowerCase() == "token:athenaseasonfriendxpboost") {
                                            SeasonData[Season].battlePassXPFriendBoost += PaidTier[item];

                                            MultiUpdate[0].profileChanges.push({
                                                "changeType": "statModified",
                                                "name": "season_friend_match_boost",
                                                "value": SeasonData[Season].battlePassXPFriendBoost
                                            })
                                        }

                                        if (item.toLowerCase().startsWith("currency:mtx")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                                        profile.items[key].quantity += PaidTier[item];
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        if (item.toLowerCase().startsWith("homebasebanner")) {
                                            for (var key in profile.items) {
                                                if (profile.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    profile.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    ApplyProfileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": profile.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"item_seen":false},"quantity":1};

                                                profile.items[ItemID] = Item;

                                                ApplyProfileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        if (item.toLowerCase().startsWith("athena")) {
                                            for (var key in athena.items) {
                                                if (athena.items[key].templateId.toLowerCase() == item.toLowerCase()) {
                                                    athena.items[key].attributes.item_seen = false;
                                                    ItemExists = true;

                                                    MultiUpdate[0].profileChanges.push({
                                                        "changeType": "itemAttrChanged",
                                                        "itemId": key,
                                                        "attributeName": "item_seen",
                                                        "attributeValue": athena.items[key].attributes.item_seen
                                                    })
                                                }
                                            }

                                            if (ItemExists == false) {
                                                var ItemID = functions.MakeID();
                                                var Item = {"templateId":item,"attributes":{"max_level_bonus":0,"level":1,"item_seen":false,"xp":0,"variants":[],"favorite":false},"quantity":PaidTier[item]}

                                                athena.items[ItemID] = Item;

                                                MultiUpdate[0].profileChanges.push({
                                                    "changeType": "itemAdded",
                                                    "itemId": ItemID,
                                                    "item": Item
                                                })
                                            }

                                            ItemExists = false;
                                        }

                                        lootList.push({
                                            "itemType": item,
                                            "itemGuid": item,
                                            "quantity": PaidTier[item]
                                        })
                                    }
                                }

                                var GiftBoxID = functions.MakeID();
                                var GiftBox = {"templateId":"GiftBox:gb_battlepass","attributes":{"max_level_bonus":0,"fromAccountId":"","lootList":lootList}}

                                if (Number(Season.split("Season")[1]) > 2) {
                                    profile.items[GiftBoxID] = GiftBox;
                                    
                                    ApplyProfileChanges.push({
                                        "changeType": "itemAdded",
                                        "itemId": GiftBoxID,
                                        "item": GiftBox
                                    })
                                }

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "statModified",
                                    "name": "book_level",
                                    "value": SeasonData[Season].battlePassTier
                                })

                                AthenaModified = true;
                            }

                            fs.writeFileSync("./responses/Athena/SeasonData.json", JSON.stringify(SeasonData, null, 2));
                        }
                    }
                }
            }

            if (value.name.startsWith("BR")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            const ID = functions.MakeID();

                            for (var key in athena.items) {
                                if (value.templateId.toLowerCase() == athena.items[key].templateId.toLowerCase()) {
                                    ItemExists = true;
                                }
                            }

                            if (ItemExists == false) {
                                if (MultiUpdate.length == 0) {
                                    MultiUpdate.push({
                                        "profileRevision": athena.rvn || 0,
                                        "profileId": "athena",
                                        "profileChangesBaseRevision": athena.rvn || 0,
                                        "profileChanges": [],
                                        "profileCommandRevision": athena.commandRevision || 0,
                                    })
                                }

                                if (Notifications.length == 0) {
                                    Notifications.push({
                                        "type": "CatalogPurchase",
                                        "primary": true,
                                        "lootResult": {
                                            "items": []
                                        }
                                    })
                                }

                                const Item = {
                                    "templateId": value.templateId,
                                    "attributes": {
                                        "max_level_bonus": 0,
                                        "level": 1,
                                        "item_seen": false,
                                        "xp": 0,
                                        "variants": [],
                                        "favorite": false
                                    },
                                    "quantity": 1
                                };

                                athena.items[ID] = Item;

                                MultiUpdate[0].profileChanges.push({
                                    "changeType": "itemAdded",
                                    "itemId": ID,
                                    "item": Item
                                })

                                Notifications[0].lootResult.items.push({
                                    "itemType": value.templateId,
                                    "itemGuid": ID,
                                    "itemProfile": "athena",
                                    "quantity": value.quantity
                                })

                                AthenaModified = true;
                            }

                            ItemExists = false;
                        })
                        // Vbucks spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                            for (var key in profile.items) {
                                if (profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) {
                                    if (profile.items[key].attributes.platform.toLowerCase() == profile.stats.attributes.current_mtx_platform.toLowerCase() || profile.items[key].attributes.platform.toLowerCase() == "shared") {
                                        profile.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * req.body.purchaseQuantity || 1;
                                                
                                        ApplyProfileChanges.push({
                                            "changeType": "itemQuantityChanged",
                                            "itemId": key,
                                            "quantity": profile.items[key].quantity
                                        })
                        
                                        break;
                                    }
                                }
                            }
                        }

                        if (catalog.storefronts[a].catalogEntries[b].itemGrants.length != 0) {
                            // Add to refunding tab
                            var purchaseId = functions.MakeID();
                            profile.stats.attributes.mtx_purchase_history.purchases.push({"purchaseId":purchaseId,"offerId":`v2:/${purchaseId}`,"purchaseDate":new Date().toISOString(),"freeRefundEligible":false,"fulfillments":[],"lootResult":Notifications[0].lootResult.items,"totalMtxPaid":catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice,"metadata":{},"gameContext":""})

                            ApplyProfileChanges.push({
                                "changeType": "statModified",
                                "name": "mtx_purchase_history",
                                "value": profile.stats.attributes.mtx_purchase_history
                            })
                        }

                        profile.rvn += 1;
                        profile.commandRevision += 1;
                    }
                })
            }

            if (value.name.startsWith("STW")) {
                catalog.storefronts[a].catalogEntries.forEach(function(value, b) {
                    if (value.offerId == req.body.offerId) {
                        catalog.storefronts[a].catalogEntries[b].itemGrants.forEach(function(value, c) {
                            const ID = functions.MakeID();

                            if (MultiUpdate.length == 0) {
                                MultiUpdate.push({
                                    "profileRevision": campaign.rvn || 0,
                                    "profileId": "campaign",
                                    "profileChangesBaseRevision": campaign.rvn || 0,
                                    "profileChanges": [],
                                    "profileCommandRevision": campaign.commandRevision || 0,
                                })
                            }

                            if (Notifications.length == 0) {
                                Notifications.push({
                                    "type": "CatalogPurchase",
                                    "primary": true,
                                    "lootResult": {
                                        "items": []
                                    }
                                })
                            }

                            var Item = {"templateId": value.templateId, "attributes": {"legacy_alterations": [], "max_level_bonus": 0, "level": 1, "refund_legacy_item": false, "item_seen": false, "alterations": ["", "", "", "", "", ""], "xp": 0, "refundable": false, "alteration_base_rarities": [], "favorite": false}, "quantity": req.body.purchaseQuantity * value.quantity || 1};

                            if (Item.templateId.toLowerCase().startsWith("worker:")) {
                                Item.attributes = functions.MakeSurvivorAttributes(Item.templateId);
                            }

                            campaign.items[ID] = Item;

                            MultiUpdate[0].profileChanges.push({
                                "changeType": "itemAdded",
                                "itemId": ID,
                                "item": Item
                            })

                            Notifications[0].lootResult.items.push({
                                "itemType": value.templateId,
                                "itemGuid": ID,
                                "itemProfile": "campaign",
                                "quantity": req.body.purchaseQuantity * value.quantity || 1
                            })
                        })
                        // STW currency spending
                        if (catalog.storefronts[a].catalogEntries[b].prices[0].currencyType.toLowerCase() == "gameitem") {
                            for (var key in campaign.items) {
                                if (campaign.items[key].templateId.toLowerCase() == catalog.storefronts[a].catalogEntries[b].prices[0].currencySubType.toLowerCase()) {
                                    campaign.items[key].quantity -= (catalog.storefronts[a].catalogEntries[b].prices[0].finalPrice) * req.body.purchaseQuantity || 1;
                                            
                                    MultiUpdate[0].profileChanges.push({
                                        "changeType": "itemQuantityChanged",
                                        "itemId": key,
                                        "quantity": campaign.items[key].quantity
                                    })
                    
                                    break;
                                }
                            }
                        }

                        profile.rvn += 1;
                        profile.commandRevision += 1;
                    }
                })
            }
        })

        if (AthenaModified == true) {
            athena.rvn += 1;
            athena.commandRevision += 1;

            if (MultiUpdate[0]) {
                MultiUpdate[0].profileRevision = athena.rvn || 0;
                MultiUpdate[0].profileCommandRevision = athena.commandRevision || 0;
            }

            fs.writeFileSync("./profiles/athena.json", JSON.stringify(athena, null, 2));
            fs.writeFileSync(`./profiles/${req.query.profileId || "common_core"}.json`, JSON.stringify(profile, null, 2));
        }

        if (AthenaModified == false) {
            campaign.rvn += 1;
            campaign.commandRevision += 1;

            if (MultiUpdate[0]) {
                MultiUpdate[0].profileRevision = campaign.rvn || 0;
                MultiUpdate[0].profileCommandRevision = campaign.commandRevision || 0;
            }

            fs.writeFileSync("./profiles/campaign.json", JSON.stringify(campaign, null, 2));
            fs.writeFileSync(`./profiles/${req.query.profileId || "common_core"}.json`, JSON.stringify(profile, null, 2));
        }
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "profile0",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "notifications": Notifications,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "multiUpdate": MultiUpdate,
        "responseVersion": 1
    })
    res.end();
});

// Set auto claim for a season pass
express.post("/fortnite/api/game/v2/profile/*/client/SetSeasonPassAutoClaim", async (req, res) => {
    const profile = require(`./../profiles/${req.query.profileId || "athena"}.json`);

    // do not change any of these or you will end up breaking it
    var ApplyProfileChanges = [];
    var BaseRevision = profile.rvn || 0;
    var QueryRevision = req.query.rvn || -1;
    var StatChanged = false;

    if (req.body.seasonIds && req.body.bEnabled !== undefined) {
        for (var seasonId of req.body.seasonIds) {
            if (!profile.stats.attributes.hasOwnProperty("auto_spend_season_currency_ids")) {
                profile.stats.attributes.auto_spend_season_currency_ids = [];
            }
    
            if (req.body.bEnabled === true) {
                if (!profile.stats.attributes.auto_spend_season_currency_ids.includes(seasonId)) {
                    profile.stats.attributes.auto_spend_season_currency_ids.push(seasonId);
                    StatChanged = true;
                }
            } else {
                let index = profile.stats.attributes.auto_spend_season_currency_ids.indexOf(seasonId);
                if (index !== -1) {
                    profile.stats.attributes.auto_spend_season_currency_ids.splice(index, 1);
                    StatChanged = true;
                }
            }
        }
    }    

    if (StatChanged == true) {
        ApplyProfileChanges.push({
            "changeType": "statModified",
            "name": "auto_spend_season_currency_ids",
            "value": profile.stats.attributes.auto_spend_season_currency_ids
        })

        profile.rvn += 1;
        profile.commandRevision += 1;

        fs.writeFileSync(`./profiles/${req.query.profileId || "athena"}.json`, JSON.stringify(profile, null, 2));
    }

    // this doesn't work properly on version v12.20 and above but whatever
    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        "profileRevision": profile.rvn || 0,
        "profileId": req.query.profileId || "athena",
        "profileChangesBaseRevision": BaseRevision,
        "profileChanges": ApplyProfileChanges,
        "profileCommandRevision": profile.commandRevision || 0,
        "serverTime": new Date().toISOString(),
        "responseVersion": 1
    })
    res.end();
});


app.post("/fortnite/api/game/v2/profile/*/client/GiftCatalogEntry", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    let profile = profiles.profiles[req.query.profileId];

    if (req.query.profileId != "common_core") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `GiftCatalogEntry is not valid on ${req.query.profileId} profile`, 
        ["GiftCatalogEntry",req.query.profileId], 12801, undefined, 400, res
    );

    const memory = functions.GetVersionInfo(req);

    let Notifications = [];
    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;
    let validGiftBoxes = [
        "GiftBox:gb_default",
        "GiftBox:gb_giftwrap1",
        "GiftBox:gb_giftwrap2",
        "GiftBox:gb_giftwrap3"
    ];

    let missingFields = checkFields(["offerId","receiverAccountIds","giftWrapTemplateId"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.offerId != "string") return ValidationError("offerId", "a string", res);
    if (!Array.isArray(req.body.receiverAccountIds)) return ValidationError("receiverAccountIds", "an array", res);
    if (typeof req.body.giftWrapTemplateId != "string") return ValidationError("giftWrapTemplateId", "a string", res);
    if (typeof req.body.personalMessage != "string") return ValidationError("personalMessage", "a string", res);

    if (req.body.personalMessage.length > 100) return error.createError(
        "errors.com.epicgames.string.length_check",
        `The personalMessage you provided is longer than 100 characters, please make sure your personal message is less than 100 characters long and try again.`,
        undefined, 16027, undefined, 400, res
    );

    if (!validGiftBoxes.includes(req.body.giftWrapTemplateId)) return error.createError(
        "errors.com.epicgames.giftbox.invalid",
        `The giftbox you provided is invalid, please provide a valid giftbox and try again.`,
        undefined, 16027, undefined, 400, res
    );

    if (req.body.receiverAccountIds.length < 1 || req.body.receiverAccountIds.length > 5) return error.createError(
        "errors.com.epicgames.item.quantity.range_check",
        `You need to atleast gift to 1 person and can not gift to more than 5 people.`,
        undefined, 16027, undefined, 400, res
    );

    if (checkIfDuplicateExists(req.body.receiverAccountIds)) return error.createError(
        "errors.com.epicgames.array.duplicate_found",
        `There are duplicate accountIds in receiverAccountIds, please remove the duplicates and try again.`,
        undefined, 16027, undefined, 400, res
    );

    let sender = await Friends.findOne({ accountId: req.user.accountId }).lean();

    for (let receiverId of req.body.receiverAccountIds) {
        if (typeof receiverId != "string") return error.createError(
            "errors.com.epicgames.array.invalid_string",
            `There is a non-string object inside receiverAccountIds, please provide a valid value and try again.`,
            undefined, 16027, undefined, 400, res
        );

        if (!sender.list.accepted.find(i => i.accountId == receiverId) && receiverId != req.user.accountId) return error.createError(
            "errors.com.epicgames.friends.no_relationship",
            `User ${req.user.accountId} is not friends with ${receiverId}`,
            [req.user.accountId,receiverId], 28004, undefined, 403, res
        );
    }

    if (!profile.items) profile.items = {};

    let findOfferId = functions.getOfferID(req.body.offerId);
    if (!findOfferId) return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `Offer ID (id: '${req.body.offerId}') not found`, 
        [req.body.offerId], 16027, undefined, 400, res
    );

    switch (true) {
        case /^BR(Daily|Weekly)Storefront$/.test(findOfferId.name):
            if (findOfferId.offerId.prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                let paid = false;
                let price = (findOfferId.offerId.prices[0].finalPrice) * req.body.receiverAccountIds.length;

                for (let key in profile.items) {
                    if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;

                    let currencyPlatform = profile.items[key].attributes.platform;
                    if ((currencyPlatform.toLowerCase() != profile.stats.attributes.current_mtx_platform.toLowerCase()) && (currencyPlatform.toLowerCase() != "shared")) continue;

                    if (profile.items[key].quantity < price) return error.createError(
                        "errors.com.epicgames.currency.mtx.insufficient",
                        `You can not afford this item (${price}), you only have ${profile.items[key].quantity}.`,
                        [`${price}`,`${profile.items[key].quantity}`], 1040, undefined, 400, res
                    );

                    profile.items[key].quantity -= price;
                        
                    ApplyProfileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": key,
                        "quantity": profile.items[key].quantity
                    });
        
                    paid = true;
        
                    break;
                }

                if (!paid && price > 0) return error.createError(
                    "errors.com.epicgames.currency.mtx.insufficient",
                    `You can not afford this item.`,
                    [], 1040, undefined, 400, res
                );
            }

            for (let receiverId of req.body.receiverAccountIds) {
                const receiverProfiles = await Profile.findOne({ accountId: receiverId });
                let athena = receiverProfiles.profiles["athena"];
                let common_core = receiverProfiles.profiles["common_core"];

                if (!athena.items) athena.items = {};

                if (!common_core.stats.attributes.allowed_to_receive_gifts) return error.createError(
                    "errors.com.epicgames.user.gift_disabled",
                    `User ${receiverId} has disabled receiving gifts.`,
                    [receiverId], 28004, undefined, 403, res
                );

                for (let itemGrant of findOfferId.offerId.itemGrants) {
                    for (let itemId in athena.items) {
                        if (itemGrant.templateId.toLowerCase() == athena.items[itemId].templateId.toLowerCase()) return error.createError(
                            "errors.com.epicgames.modules.gamesubcatalog.purchase_not_allowed",
                            `User ${receiverId} already owns this item.`,
                            [receiverId], 28004, undefined, 403, res
                        );
                    }
                }
            }

            for (let receiverId of req.body.receiverAccountIds) {
                const receiverProfiles = await Profile.findOne({ accountId: receiverId });
                let athena = receiverProfiles.profiles["athena"];
                let common_core = ((receiverId == req.user.accountId) ? profile : receiverProfiles.profiles["common_core"]);

                let giftBoxItemID = functions.MakeID();
                let giftBoxItem = {
                    "templateId": req.body.giftWrapTemplateId,
                    "attributes": {
                        "fromAccountId": req.user.accountId,
                        "lootList": [],
                        "params": {
                            "userMessage": req.body.personalMessage
                        },
                        "level": 1,
                        "giftedOn": new Date().toISOString()
                    },
                    "quantity": 1
                };

                if (!athena.items) athena.items = {};
                if (!common_core.items) common_core.items = {};

                for (let value of findOfferId.offerId.itemGrants) {
                    const ID = functions.MakeID();

                    const Item = {
                        "templateId": value.templateId,
                        "attributes": {
                            "item_seen": false,
                            "variants": [],
                        },
                        "quantity": 1
                    };
            
                    athena.items[ID] = Item;

                    giftBoxItem.attributes.lootList.push({
                        "itemType": Item.templateId,
                        "itemGuid": ID,
                        "itemProfile": "athena",
                        "quantity": 1
                    });
                }

                common_core.items[giftBoxItemID] = giftBoxItem;

                if (receiverId == req.user.accountId) ApplyProfileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": giftBoxItemID,
                    "item": common_core.items[giftBoxItemID]
                });

                athena.rvn += 1;
                athena.commandRevision += 1;
                athena.updated = new Date().toISOString();

                common_core.rvn += 1;
                common_core.commandRevision += 1;
                common_core.updated = new Date().toISOString();

                await receiverProfiles.updateOne({ $set: { [`profiles.athena`]: athena, [`profiles.common_core`]: common_core } });

                global.giftReceived[receiverId] = true;

                functions.sendXmppMessageToId({
                    type: "com.epicgames.gift.received",
                    payload: {},
                    timestamp: new Date().toISOString()
                }, receiverId);
            }
        break;
    }

    if (ApplyProfileChanges.length > 0 && !req.body.receiverAccountIds.includes(req.user.accountId)) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        notifications: Notifications,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/RemoveGiftBox", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    let profile = profiles.profiles[req.query.profileId];

    if (req.query.profileId != "common_core" && req.query.profileId != "profile0") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `RemoveGiftBox is not valid on ${req.query.profileId} profile`, 
        ["RemoveGiftBox",req.query.profileId], 12801, undefined, 400, res
    );

    const memory = functions.GetVersionInfo(req);

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    if (typeof req.body.giftBoxItemId == "string") {
        if (!profile.items[req.body.giftBoxItemId]) return error.createError(
            "errors.com.epicgames.fortnite.id_invalid",
            `Item (id: '${req.body.giftBoxItemId}') not found`, 
            [req.body.giftBoxItemId], 16027, undefined, 400, res
        );

        if (!profile.items[req.body.giftBoxItemId].templateId.startsWith("GiftBox:")) return error.createError(
            "errors.com.epicgames.fortnite.id_invalid",
            `The specified item id is not a giftbox.`, 
            [req.body.giftBoxItemId], 16027, undefined, 400, res
        );

        delete profile.items[req.body.giftBoxItemId];

        ApplyProfileChanges.push({
            "changeType": "itemRemoved",
            "itemId": req.body.giftBoxItemId
        });
    }

    if (Array.isArray(req.body.giftBoxItemIds)) {
        for (let giftBoxItemId of req.body.giftBoxItemIds) {
            if (typeof giftBoxItemId != "string") continue;
            if (!profile.items[giftBoxItemId]) continue;
            if (!profile.items[giftBoxItemId].templateId.startsWith("GiftBox:")) continue;
    
            delete profile.items[giftBoxItemId];
    
            ApplyProfileChanges.push({
                "changeType": "itemRemoved",
                "itemId": giftBoxItemId
            });
        }
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/PurchaseCatalogEntry", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    let profile = profiles.profiles[req.query.profileId];
    let athena = profiles.profiles["athena"];

    if (req.query.profileId != "common_core" && req.query.profileId != "profile0") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `PurchaseCatalogEntry is not valid on ${req.query.profileId} profile`, 
        ["PurchaseCatalogEntry",req.query.profileId], 12801, undefined, 400, res
    );

    let MultiUpdate = [{
        "profileRevision": athena.rvn || 0,
        "profileId": "athena",
        "profileChangesBaseRevision": athena.rvn || 0,
        "profileChanges": [],
        "profileCommandRevision": athena.commandRevision || 0,
    }];

    const memory = functions.GetVersionInfo(req);

    let Notifications = [];
    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    let missingFields = checkFields(["offerId"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.offerId != "string") return ValidationError("offerId", "a string", res);
    if (typeof req.body.purchaseQuantity != "number") return ValidationError("purchaseQuantity", "a number", res);
    if (req.body.purchaseQuantity < 1) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. 'purchaseQuantity' is less than 1.`,
        ['purchaseQuantity'], 1040, undefined, 400, res
    );

    if (!profile.items) profile.items = {};
    if (!athena.items) athena.items = {};

    let findOfferId = functions.getOfferID(req.body.offerId);
    if (!findOfferId) return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `Offer ID (id: '${req.body.offerId}') not found`, 
        [req.body.offerId], 16027, undefined, 400, res
    );

    switch (true) {
        case /^BR(Daily|Weekly|Season)Storefront$/.test(findOfferId.name):
            Notifications.push({
                "type": "CatalogPurchase",
                "primary": true,
                "lootResult": {
                    "items": []
                }
            });

            for (let value of findOfferId.offerId.itemGrants) {
                const ID = functions.MakeID();

                for (let itemId in athena.items) {
                    if (value.templateId.toLowerCase() == athena.items[itemId].templateId.toLowerCase()) return error.createError(
                        "errors.com.epicgames.offer.already_owned",
                        `You have already bought this item before.`,
                        undefined, 1040, undefined, 400, res
                    );
                }

                const Item = {
                    "templateId": value.templateId,
                    "attributes": {
                        "item_seen": false,
                        "variants": [],
                    },
                    "quantity": 1
                };
        
                athena.items[ID] = Item;
        
                MultiUpdate[0].profileChanges.push({
                    "changeType": "itemAdded",
                    "itemId": ID,
                    "item": athena.items[ID]
                });
        
                Notifications[0].lootResult.items.push({
                    "itemType": Item.templateId,
                    "itemGuid": ID,
                    "itemProfile": "athena",
                    "quantity": 1
                });
            }

            if (findOfferId.offerId.prices[0].currencyType.toLowerCase() == "mtxcurrency") {
                let paid = false;

                for (let key in profile.items) {
                    if (!profile.items[key].templateId.toLowerCase().startsWith("currency:mtx")) continue;

                    let currencyPlatform = profile.items[key].attributes.platform;
                    if ((currencyPlatform.toLowerCase() != profile.stats.attributes.current_mtx_platform.toLowerCase()) && (currencyPlatform.toLowerCase() != "shared")) continue;

                    if (profile.items[key].quantity < findOfferId.offerId.prices[0].finalPrice) return error.createError(
                        "errors.com.epicgames.currency.mtx.insufficient",
                        `You can not afford this item (${findOfferId.offerId.prices[0].finalPrice}), you only have ${profile.items[key].quantity}.`,
                        [`${findOfferId.offerId.prices[0].finalPrice}`,`${profile.items[key].quantity}`], 1040, undefined, 400, res
                    );

                    profile.items[key].quantity -= findOfferId.offerId.prices[0].finalPrice;
                        
                    ApplyProfileChanges.push({
                        "changeType": "itemQuantityChanged",
                        "itemId": key,
                        "quantity": profile.items[key].quantity
                    });
        
                    paid = true;
        
                    break;
                }

                if (!paid && findOfferId.offerId.prices[0].finalPrice > 0) return error.createError(
                    "errors.com.epicgames.currency.mtx.insufficient",
                    `You can not afford this item (${findOfferId.offerId.prices[0].finalPrice}).`,
                    [`${findOfferId.offerId.prices[0].finalPrice}`], 1040, undefined, 400, res
                );
            }

            if (MultiUpdate[0].profileChanges.length > 0) {
                athena.rvn += 1;
                athena.commandRevision += 1;
                athena.updated = new Date().toISOString();

                MultiUpdate[0].profileRevision = athena.rvn;
                MultiUpdate[0].profileCommandRevision = athena.commandRevision;
            }
        break;
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile, [`profiles.athena`]: athena } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        notifications: Notifications,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/MarkItemSeen", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    let missingFields = checkFields(["itemIds"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (!Array.isArray(req.body.itemIds)) return ValidationError("itemIds", "an array", res);

    if (!profile.items) profile.items = {};
    
    for (let i in req.body.itemIds) {
        if (!profile.items[req.body.itemIds[i]]) continue;
        
        profile.items[req.body.itemIds[i]].attributes.item_seen = true;
        
        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.itemIds[i],
            "attributeName": "item_seen",
            "attributeValue": true
        });
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/SetItemFavoriteStatusBatch", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    if (req.query.profileId != "athena") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `SetItemFavoriteStatusBatch is not valid on ${req.query.profileId} profile`, 
        ["SetItemFavoriteStatusBatch",req.query.profileId], 12801, undefined, 400, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    let missingFields = checkFields(["itemIds","itemFavStatus"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (!Array.isArray(req.body.itemIds)) return ValidationError("itemIds", "an array", res);
    if (!Array.isArray(req.body.itemFavStatus)) return ValidationError("itemFavStatus", "an array", res);

    if (!profile.items) profile.items = {};

    for (let i in req.body.itemIds) {
        if (!profile.items[req.body.itemIds[i]]) continue;
        if (typeof req.body.itemFavStatus[i] != "boolean") continue;

        profile.items[req.body.itemIds[i]].attributes.favorite = req.body.itemFavStatus[i];

        ApplyProfileChanges.push({
            "changeType": "itemAttrChanged",
            "itemId": req.body.itemIds[i],
            "attributeName": "favorite",
            "attributeValue": profile.items[req.body.itemIds[i]].attributes.favorite
        });
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/SetBattleRoyaleBanner", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    if (req.query.profileId != "athena") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `SetBattleRoyaleBanner is not valid on ${req.query.profileId} profile`, 
        ["SetBattleRoyaleBanner",req.query.profileId], 12801, undefined, 400, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    let missingFields = checkFields(["homebaseBannerIconId","homebaseBannerColorId"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.homebaseBannerIconId != "string") return ValidationError("homebaseBannerIconId", "a string", res);
    if (typeof req.body.homebaseBannerColorId != "string") return ValidationError("homebaseBannerColorId", "a string", res);

    let bannerProfileId = memory.build < 3.5 ? "profile0" : "common_core";

    let HomebaseBannerIconID = "";
    let HomebaseBannerColorID = "";

    if (!profiles.profiles[bannerProfileId].items) profiles.profiles[bannerProfileId].items = {};

    for (let itemId in profiles.profiles[bannerProfileId].items) {
        let templateId = profiles.profiles[bannerProfileId].items[itemId].templateId;

        if (templateId.toLowerCase() == `HomebaseBannerIcon:${req.body.homebaseBannerIconId}`.toLowerCase()) { HomebaseBannerIconID = itemId; continue; }
        if (templateId.toLowerCase() == `HomebaseBannerColor:${req.body.homebaseBannerColorId}`.toLowerCase()) { HomebaseBannerColorID = itemId; continue; }

        if (HomebaseBannerIconID && HomebaseBannerColorID) break;
    }

    if (!HomebaseBannerIconID) return error.createError(
        "errors.com.epicgames.fortnite.item_not_found",
        `Banner template 'HomebaseBannerIcon:${req.body.homebaseBannerIconId}' not found in profile`, 
        [`HomebaseBannerIcon:${req.body.homebaseBannerIconId}`], 16006, undefined, 400, res
    );

    if (!HomebaseBannerColorID) return error.createError(
        "errors.com.epicgames.fortnite.item_not_found",
        `Banner template 'HomebaseBannerColor:${req.body.homebaseBannerColorId}' not found in profile`, 
        [`HomebaseBannerColor:${req.body.homebaseBannerColorId}`], 16006, undefined, 400, res
    );

    if (!profile.items) profile.items = {};

    let activeLoadoutId = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];

    profile.stats.attributes.banner_icon = req.body.homebaseBannerIconId;
    profile.stats.attributes.banner_color = req.body.homebaseBannerColorId;

    profile.items[activeLoadoutId].attributes.banner_icon_template = req.body.homebaseBannerIconId;
    profile.items[activeLoadoutId].attributes.banner_color_template = req.body.homebaseBannerColorId;

    ApplyProfileChanges.push({
        "changeType": "statModified",
        "name": "banner_icon",
        "value": profile.stats.attributes.banner_icon
    });
    
    ApplyProfileChanges.push({
        "changeType": "statModified",
        "name": "banner_color",
        "value": profile.stats.attributes.banner_color
    });

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/EquipBattleRoyaleCustomization", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    if (req.query.profileId != "athena") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `EquipBattleRoyaleCustomization is not valid on ${req.query.profileId} profile`, 
        ["EquipBattleRoyaleCustomization",req.query.profileId], 12801, undefined, 400, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;
    let specialCosmetics = [
        "AthenaCharacter:cid_random",
        "AthenaBackpack:bid_random",
        "AthenaPickaxe:pickaxe_random",
        "AthenaGlider:glider_random",
        "AthenaSkyDiveContrail:trails_random",
        "AthenaItemWrap:wrap_random",
        "AthenaMusicPack:musicpack_random",
        "AthenaLoadingScreen:lsid_random"
    ];

    let missingFields = checkFields(["slotName"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.itemToSlot != "string") return ValidationError("itemToSlot", "a string", res);
    if (typeof req.body.slotName != "string") return ValidationError("slotName", "a string", res);

    if (!profile.items) profile.items = {};

    if (!profile.items[req.body.itemToSlot] && req.body.itemToSlot) {
        let item = req.body.itemToSlot;

        if (!specialCosmetics.includes(item)) {
            return error.createError(
                "errors.com.epicgames.fortnite.id_invalid",
                `Item (id: '${req.body.itemToSlot}') not found`, 
                [req.body.itemToSlot], 16027, undefined, 400, res
            );
        } else {
            if (!item.startsWith(`Athena${req.body.slotName}:`)) return error.createError(
                "errors.com.epicgames.fortnite.id_invalid",
                `Cannot slot item of type ${item.split(":")[0]} in slot of category ${req.body.slotName}`, 
                [item.split(":")[0],req.body.slotName], 16027, undefined, 400, res
            );
        }
    }

    if (profile.items[req.body.itemToSlot]) {
        if (!profile.items[req.body.itemToSlot].templateId.startsWith(`Athena${req.body.slotName}:`)) return error.createError(
            "errors.com.epicgames.fortnite.id_invalid",
            `Cannot slot item of type ${profile.items[req.body.itemToSlot].templateId.split(":")[0]} in slot of category ${req.body.slotName}`, 
            [profile.items[req.body.itemToSlot].templateId.split(":")[0],req.body.slotName], 16027, undefined, 400, res
        );

        let Variants = req.body.variantUpdates;

        if (Array.isArray(Variants)) {
            for (let i in Variants) {
                if (typeof Variants[i] != "object") continue;
                if (!Variants[i].channel) continue;
                if (!Variants[i].active) continue;

                let index = profile.items[req.body.itemToSlot].attributes.variants.findIndex(x => x.channel == Variants[i].channel);

                if (index == -1) continue;
                if (!profile.items[req.body.itemToSlot].attributes.variants[index].owned.includes(Variants[i].active)) continue;

                profile.items[req.body.itemToSlot].attributes.variants[index].active = Variants[i].active;
            }

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": req.body.itemToSlot,
                "attributeName": "variants",
                "attributeValue": profile.items[req.body.itemToSlot].attributes.variants
            });
        }
    }

    let slotNames = ["Character","Backpack","Pickaxe","Glider","SkyDiveContrail","MusicPack","LoadingScreen"];

    let activeLoadoutId = profile.stats.attributes.loadouts[profile.stats.attributes.active_loadout_index];
    let templateId = profile.items[req.body.itemToSlot] ? profile.items[req.body.itemToSlot].templateId : req.body.itemToSlot;
    
    switch (req.body.slotName) {
        case "Dance":
            if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[req.body.slotName]) break;

            if (typeof req.body.indexWithinSlot != "number") return ValidationError("indexWithinSlot", "a number", res);

            if (req.body.indexWithinSlot >= 0 && req.body.indexWithinSlot <= 5) {
                profile.stats.attributes.favorite_dance[req.body.indexWithinSlot] = req.body.itemToSlot;
                profile.items[activeLoadoutId].attributes.locker_slots_data.slots.Dance.items[req.body.indexWithinSlot] = templateId;

                ApplyProfileChanges.push({
                    "changeType": "statModified",
                    "name": "favorite_dance",
                    "value": profile.stats.attributes["favorite_dance"]
                });
            }
        break;

        case "ItemWrap":
            if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[req.body.slotName]) break;

            if (typeof req.body.indexWithinSlot != "number") return ValidationError("indexWithinSlot", "a number", res);

            switch (true) {
                case req.body.indexWithinSlot >= 0 && req.body.indexWithinSlot <= 7:
                    profile.stats.attributes.favorite_itemwraps[req.body.indexWithinSlot] = req.body.itemToSlot;
                    profile.items[activeLoadoutId].attributes.locker_slots_data.slots.ItemWrap.items[req.body.indexWithinSlot] = templateId;

                    ApplyProfileChanges.push({
                        "changeType": "statModified",
                        "name": "favorite_itemwraps",
                        "value": profile.stats.attributes["favorite_itemwraps"]
                    });
                break;

                case req.body.indexWithinSlot == -1:
                    for (let i = 0; i < 7; i++) {
                        profile.stats.attributes.favorite_itemwraps[i] = req.body.itemToSlot;
                        profile.items[activeLoadoutId].attributes.locker_slots_data.slots.ItemWrap.items[i] = templateId;
                    }

                    ApplyProfileChanges.push({
                        "changeType": "statModified",
                        "name": "favorite_itemwraps",
                        "value": profile.stats.attributes["favorite_itemwraps"]
                    });
                break;
            }
        break;

        default:
            if (!slotNames.includes(req.body.slotName)) break;
            if (!profile.items[activeLoadoutId].attributes.locker_slots_data.slots[req.body.slotName]) break;

            if (req.body.slotName == "Pickaxe" || req.body.slotName == "Glider") {
                if (!req.body.itemToSlot) return error.createError(
                    "errors.com.epicgames.fortnite.id_invalid",
                    `${req.body.slotName} can not be empty.`, 
                    [req.body.slotName], 16027, undefined, 400, res
                );
            }

            profile.stats.attributes[(`favorite_${req.body.slotName}`).toLowerCase()] = req.body.itemToSlot;
            profile.items[activeLoadoutId].attributes.locker_slots_data.slots[req.body.slotName].items = [templateId];

            ApplyProfileChanges.push({
                "changeType": "statModified",
                "name": (`favorite_${req.body.slotName}`).toLowerCase(),
                "value": profile.stats.attributes[(`favorite_${req.body.slotName}`).toLowerCase()]
            });
        break;
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/SetCosmeticLockerBanner", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    if (req.query.profileId != "athena") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `SetCosmeticLockerBanner is not valid on ${req.query.profileId} profile`, 
        ["SetCosmeticLockerBanner",req.query.profileId], 12801, undefined, 400, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    let missingFields = checkFields(["bannerIconTemplateName","bannerColorTemplateName","lockerItem"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.lockerItem != "string") return ValidationError("lockerItem", "a string", res);
    if (typeof req.body.bannerIconTemplateName != "string") return ValidationError("bannerIconTemplateName", "a string", res);
    if (typeof req.body.bannerColorTemplateName != "string") return ValidationError("bannerColorTemplateName", "a string", res);

    if (!profile.items) profile.items = {};

    if (!profile.items[req.body.lockerItem]) return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `Item (id: '${req.body.lockerItem}') not found`, 
        [req.body.lockerItem], 16027, undefined, 400, res
    );

    if (profile.items[req.body.lockerItem].templateId.toLowerCase() != "cosmeticlocker:cosmeticlocker_athena") return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `lockerItem id is not a cosmeticlocker`, 
        ["lockerItem"], 16027, undefined, 400, res
    );

    let bannerProfileId = "common_core";

    let HomebaseBannerIconID = "";
    let HomebaseBannerColorID = "";

    if (!profiles.profiles[bannerProfileId].items) profiles.profiles[bannerProfileId].items = {};

    for (let itemId in profiles.profiles[bannerProfileId].items) {
        let templateId = profiles.profiles[bannerProfileId].items[itemId].templateId;

        if (templateId.toLowerCase() == `HomebaseBannerIcon:${req.body.bannerIconTemplateName}`.toLowerCase()) { HomebaseBannerIconID = itemId; continue; }
        if (templateId.toLowerCase() == `HomebaseBannerColor:${req.body.bannerColorTemplateName}`.toLowerCase()) { HomebaseBannerColorID = itemId; continue; }

        if (HomebaseBannerIconID && HomebaseBannerColorID) break;
    }

    if (!HomebaseBannerIconID) return error.createError(
        "errors.com.epicgames.fortnite.item_not_found",
        `Banner template 'HomebaseBannerIcon:${req.body.bannerIconTemplateName}' not found in profile`, 
        [`HomebaseBannerIcon:${req.body.bannerIconTemplateName}`], 16006, undefined, 400, res
    );

    if (!HomebaseBannerColorID) return error.createError(
        "errors.com.epicgames.fortnite.item_not_found",
        `Banner template 'HomebaseBannerColor:${req.body.bannerColorTemplateName}' not found in profile`, 
        [`HomebaseBannerColor:${req.body.bannerColorTemplateName}`], 16006, undefined, 400, res
    );

    profile.items[req.body.lockerItem].attributes.banner_icon_template = req.body.bannerIconTemplateName;
    profile.items[req.body.lockerItem].attributes.banner_color_template = req.body.bannerColorTemplateName;

    profile.stats.attributes.banner_icon = req.body.bannerIconTemplateName;
    profile.stats.attributes.banner_color = req.body.bannerColorTemplateName;

    ApplyProfileChanges.push({
        "changeType": "itemAttrChanged",
        "itemId": req.body.lockerItem,
        "attributeName": "banner_icon_template",
        "attributeValue": profile.items[req.body.lockerItem].attributes.banner_icon_template
    });

    ApplyProfileChanges.push({
        "changeType": "itemAttrChanged",
        "itemId": req.body.lockerItem,
        "attributeName": "banner_color_template",
        "attributeValue": profile.items[req.body.lockerItem].attributes.banner_color_template
    });

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/SetCosmeticLockerSlot", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );

    if (req.query.profileId != "athena") return error.createError(
        "errors.com.epicgames.modules.profiles.invalid_command",
        `SetCosmeticLockerSlot is not valid on ${req.query.profileId} profile`, 
        ["SetCosmeticLockerSlot",req.query.profileId], 12801, undefined, 400, res
    );

    let profile = profiles.profiles[req.query.profileId];

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;
    let specialCosmetics = [
        "AthenaCharacter:cid_random",
        "AthenaBackpack:bid_random",
        "AthenaPickaxe:pickaxe_random",
        "AthenaGlider:glider_random",
        "AthenaSkyDiveContrail:trails_random",
        "AthenaItemWrap:wrap_random",
        "AthenaMusicPack:musicpack_random",
        "AthenaLoadingScreen:lsid_random"
    ];

    let missingFields = checkFields(["category","lockerItem"], req.body);

    if (missingFields.fields.length > 0) return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. [${missingFields.fields.join(", ")}] field(s) is missing.`,
        [`[${missingFields.fields.join(", ")}]`], 1040, undefined, 400, res
    );

    if (typeof req.body.itemToSlot != "string") return ValidationError("itemToSlot", "a string", res);
    if (typeof req.body.slotIndex != "number") return ValidationError("slotIndex", "a number", res);
    if (typeof req.body.lockerItem != "string") return ValidationError("lockerItem", "a string", res);
    if (typeof req.body.category != "string") return ValidationError("category", "a string", res);

    if (!profile.items) profile.items = {};

    let itemToSlotID = "";

    if (req.body.itemToSlot) {
        for (let itemId in profile.items) {
            if (profile.items[itemId].templateId.toLowerCase() == req.body.itemToSlot.toLowerCase()) { itemToSlotID = itemId; break; };
        }
    }

    if (!profile.items[req.body.lockerItem]) return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `Item (id: '${req.body.lockerItem}') not found`, 
        [req.body.lockerItem], 16027, undefined, 400, res
    );

    if (profile.items[req.body.lockerItem].templateId.toLowerCase() != "cosmeticlocker:cosmeticlocker_athena") return error.createError(
        "errors.com.epicgames.fortnite.id_invalid",
        `lockerItem id is not a cosmeticlocker`, 
        ["lockerItem"], 16027, undefined, 400, res
    );

    if (!profile.items[itemToSlotID] && req.body.itemToSlot) {
        let item = req.body.itemToSlot;

        if (!specialCosmetics.includes(item)) {
            return error.createError(
                "errors.com.epicgames.fortnite.id_invalid",
                `Item (id: '${req.body.itemToSlot}') not found`, 
                [req.body.itemToSlot], 16027, undefined, 400, res
            );
        } else {
            if (!item.startsWith(`Athena${req.body.category}:`)) return error.createError(
                "errors.com.epicgames.fortnite.id_invalid",
                `Cannot slot item of type ${item.split(":")[0]} in slot of category ${req.body.category}`, 
                [item.split(":")[0],req.body.category], 16027, undefined, 400, res
            );
        }
    }

    if (profile.items[itemToSlotID]) {
        if (!profile.items[itemToSlotID].templateId.startsWith(`Athena${req.body.category}:`)) return error.createError(
            "errors.com.epicgames.fortnite.id_invalid",
            `Cannot slot item of type ${profile.items[itemToSlotID].templateId.split(":")[0]} in slot of category ${req.body.category}`, 
            [profile.items[itemToSlotID].templateId.split(":")[0],req.body.category], 16027, undefined, 400, res
        );

        let Variants = req.body.variantUpdates;

        if (Array.isArray(Variants)) {
            for (let i in Variants) {
                if (typeof Variants[i] != "object") continue;
                if (!Variants[i].channel) continue;
                if (!Variants[i].active) continue;

                let index = profile.items[itemToSlotID].attributes.variants.findIndex(x => x.channel == Variants[i].channel);

                if (index == -1) continue;
                if (!profile.items[itemToSlotID].attributes.variants[index].owned.includes(Variants[i].active)) continue;

                profile.items[itemToSlotID].attributes.variants[index].active = Variants[i].active;
            }

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": itemToSlotID,
                "attributeName": "variants",
                "attributeValue": profile.items[itemToSlotID].attributes.variants
            });
        }
    }
    
    switch (req.body.category) {
        case "Dance":
            if (!profile.items[req.body.lockerItem].attributes.locker_slots_data.slots[req.body.category]) break;

            if (req.body.slotIndex >= 0 && req.body.slotIndex <= 5) {
                profile.items[req.body.lockerItem].attributes.locker_slots_data.slots.Dance.items[req.body.slotIndex] = req.body.itemToSlot;
                profile.stats.attributes.favorite_dance[req.body.slotIndex] = itemToSlotID || req.body.itemToSlot;

                ApplyProfileChanges.push({
                    "changeType": "itemAttrChanged",
                    "itemId": req.body.lockerItem,
                    "attributeName": "locker_slots_data",
                    "attributeValue": profile.items[req.body.lockerItem].attributes.locker_slots_data
                });
            }
        break;

        case "ItemWrap":
            if (!profile.items[req.body.lockerItem].attributes.locker_slots_data.slots[req.body.category]) break;

            switch (true) {
                case req.body.slotIndex >= 0 && req.body.slotIndex <= 7:
                    profile.items[req.body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[req.body.slotIndex] = req.body.itemToSlot;
                    profile.stats.attributes.favorite_itemwraps[req.body.slotIndex] = itemToSlotID || req.body.itemToSlot;

                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": req.body.lockerItem,
                        "attributeName": "locker_slots_data",
                        "attributeValue": profile.items[req.body.lockerItem].attributes.locker_slots_data
                    });
                break;

                case req.body.slotIndex == -1:
                    for (let i = 0; i < 7; i++) {
                        profile.items[req.body.lockerItem].attributes.locker_slots_data.slots.ItemWrap.items[i] = req.body.itemToSlot;
                        profile.stats.attributes.favorite_itemwraps[i] = itemToSlotID || req.body.itemToSlot;
                    }

                    ApplyProfileChanges.push({
                        "changeType": "itemAttrChanged",
                        "itemId": req.body.lockerItem,
                        "attributeName": "locker_slots_data",
                        "attributeValue": profile.items[req.body.lockerItem].attributes.locker_slots_data
                    });
                break;
            }
        break;

        default:
            if (!profile.items[req.body.lockerItem].attributes.locker_slots_data.slots[req.body.category]) break;

            if (req.body.category == "Pickaxe" || req.body.category == "Glider") {
                if (!req.body.itemToSlot) return error.createError(
                    "errors.com.epicgames.fortnite.id_invalid",
                    `${req.body.category} can not be empty.`, 
                    [req.body.category], 16027, undefined, 400, res
                );
            }

            profile.items[req.body.lockerItem].attributes.locker_slots_data.slots[req.body.category].items = [req.body.itemToSlot];
            profile.stats.attributes[(`favorite_${req.body.category}`).toLowerCase()] = itemToSlotID || req.body.itemToSlot;

            ApplyProfileChanges.push({
                "changeType": "itemAttrChanged",
                "itemId": req.body.lockerItem,
                "attributeName": "locker_slots_data",
                "attributeValue": profile.items[req.body.lockerItem].attributes.locker_slots_data
            });
        break;
    }

    if (ApplyProfileChanges.length > 0) {
        profile.rvn += 1;
        profile.commandRevision += 1;
        profile.updated = new Date().toISOString();

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/*/client/:operation", verifyToken, async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.user.accountId });

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );
    
    let profile = profiles.profiles[req.query.profileId];

    if (profile.rvn == profile.commandRevision) {
        profile.rvn += 1;

        if (req.query.profileId == "athena") {
            if (!profile.stats.attributes.last_applied_loadout) profile.stats.attributes.last_applied_loadout = profile.stats.attributes.loadouts[0];
        }

        await profiles.updateOne({ $set: { [`profiles.${req.query.profileId}`]: profile } });
    }

    const memory = functions.GetVersionInfo(req);

    if (req.query.profileId == "athena") profile.stats.attributes.season_num = memory.season;

    let MultiUpdate = [];

    if ((req.query.profileId == "common_core") && global.giftReceived[req.user.accountId]) {
        global.giftReceived[req.user.accountId] = false;

        let athena = profiles.profiles["athena"];

        MultiUpdate = [{
            "profileRevision": athena.rvn || 0,
            "profileId": "athena",
            "profileChangesBaseRevision": athena.rvn || 0,
            "profileChanges": [{
                "changeType": "fullProfileUpdate",
                "profile": athena
            }],
            "profileCommandRevision": athena.commandRevision || 0,
        }];
    }

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let ProfileRevisionCheck = (memory.build >= 12.20) ? profile.commandRevision : profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    switch (req.params.operation) {
        case "QueryProfile": break;
        case "ClientQuestLogin": break;
        case "RefreshExpeditions": break;
        case "GetMcpTimeForLogin": break;
        case "IncrementNamedCounterStat": break;
        case "SetHardcoreModifier": break;
        case "SetMtxPlatform": break;
        case "BulkEquipBattleRoyaleCustomization": break;

        default:
            error.createError(
                "errors.com.epicgames.fortnite.operation_not_found",
                `Operation ${req.params.operation} not valid`, 
                [req.params.operation], 16035, undefined, 404, res
            );
        return;
    }

    if (QueryRevision != ProfileRevisionCheck) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        multiUpdate: MultiUpdate,
        responseVersion: 1
    });
});

app.post("/fortnite/api/game/v2/profile/:accountId/dedicated_server/:operation", async (req, res) => {
    const profiles = await Profile.findOne({ accountId: req.params.accountId }).lean();
    if (!profiles) return res.status(404).json({});

    if (!await profileManager.validateProfile(req.query.profileId, profiles)) return error.createError(
        "errors.com.epicgames.modules.profiles.operation_forbidden",
        `Unable to find template configuration for profile ${req.query.profileId}`, 
        [req.query.profileId], 12813, undefined, 403, res
    );
    
    let profile = profiles.profiles[req.query.profileId];

    let ApplyProfileChanges = [];
    let BaseRevision = profile.rvn;
    let QueryRevision = req.query.rvn || -1;

    if (QueryRevision != BaseRevision) {
        ApplyProfileChanges = [{
            "changeType": "fullProfileUpdate",
            "profile": profile
        }];
    }

    res.json({
        profileRevision: profile.rvn || 0,
        profileId: req.query.profileId,
        profileChangesBaseRevision: BaseRevision,
        profileChanges: ApplyProfileChanges,
        profileCommandRevision: profile.commandRevision || 0,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    });
});

function checkFields(fields, body) {
    let missingFields = { fields: [] };

    fields.forEach(field => {
        if (!body[field]) missingFields.fields.push(field);
    });

    return missingFields;
}

function ValidationError(field, type, res) {
    return error.createError(
        "errors.com.epicgames.validation.validation_failed",
        `Validation Failed. '${field}' is not ${type}.`,
        [field], 1040, undefined, 400, res
    );
}

function checkIfDuplicateExists(arr) {
    return new Set(arr).size !== arr.length
}

module.exports = app;
