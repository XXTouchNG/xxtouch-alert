import proc from 'xxtouch-proc';
const UIAlertController = ObjC.classes.UIAlertController;
const UIAlertAction = ObjC.classes.UIAlertAction;
const UIApplication = ObjC.classes.UIApplication;
const alert = (message) => {
    if (typeof message !== 'string') {
        throw new TypeError('message must be a string');
    }
    ObjC.schedule(ObjC.mainQueue, function () {
        const pool = ObjC.classes.NSAutoreleasePool.alloc().init();
        const alert = UIAlertController
            .alertControllerWithTitle_message_preferredStyle_(
                'Frida Runtime', message, 1);
        const alertHandler = new ObjC.Block({
            retType: 'void',
            argTypes: ['object'],
            implementation: function () {
                proc.send(0);
            }
        });
        var defaultAction = UIAlertAction
            .actionWithTitle_style_handler_('OK', 0, alertHandler);
        alert.addAction_(defaultAction);
        UIApplication
            .sharedApplication()
            .keyWindow()
            .rootViewController()
            .presentViewController_animated_completion_(alert, true, NULL);
        pool.release();
    });
};
export default alert;