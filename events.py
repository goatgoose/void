from abc import ABCMeta, abstractmethod


class Callback:
    def __init__(self, func, args):
        self.func = func
        self.args = args


class EventHandler:
    def __init__(self):
        self.callbacks = {}  # event : [callback]

    def add_callback(self, event, func, args=()):
        if event not in self.callbacks:
            self.callbacks[event] = []
        self.callbacks[event].append(Callback(func, args))

    def fire(self, event, args=()):
        if event in self.callbacks:
            for callback in self.callbacks[event]:
                callback.func.fire(*args)


class EventListener:
    @abstractmethod
    def fire(self, *args):
        pass

