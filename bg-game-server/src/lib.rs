use spacetimedb::{table, reducer, Table, ReducerContext, Identity, Timestamp};

#[table(name = user, public)]
pub struct User {
    #[primary_key]
    identity: Identity,
    name: Option<String>,
    first_seen: Timestamp,
    online: bool,
    position: (f32, f32),
}

#[reducer(init)]
pub fn init(_ctx: &ReducerContext) {
    // Called when the module is initially published
}

#[reducer(client_connected)]
pub fn user_connected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { online: true, ..user });
    } else {
        ctx.db.user().insert(User {
            name: None,
            identity: ctx.sender,
            first_seen: ctx.timestamp,
            online: true,
            position: (0.0, 0.0),
        });
    }
}

#[reducer(client_disconnected)]
pub fn identity_disconnected(ctx: &ReducerContext) {
    if let Some(user) = ctx.db.user().identity().find(ctx.sender) {
        ctx.db.user().identity().update(User { online: false, ..user });
    } else {
        log::warn!("Disconnect event for unknown user with identity {:?}", ctx.sender);
    }
}

#[reducer]
pub fn say_hello(ctx: &ReducerContext) {
    log::info!("Hello, World!");
    for user in ctx.db.user().iter() {
        log::info!("Hello, {:?}!", user.name);
    }
}

#[reducer]
pub fn move_position(ctx: &ReducerContext) -> Result<(), String> {
    let user = ctx
        .db
        .user()
        .identity()
        .find_mut(&ctx.sender)
        .ok_or("User not found")?;
    user.position = (user.position.0 + 1.0, user.position.1 + 1.0);
    Ok(())
}
