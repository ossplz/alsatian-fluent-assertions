import { Container } from "inversify";
import { IFluentCore, IPropertiesMatcher, PropertiesMatcher, EntityMatcher } from "./matchers";
import { Refs } from "./references";
import { ISimpleMatcher } from "./matchers/i-simple-matcher";
import { INarrowableOperators } from "./matchers/i-narrowable-operators";
import { IOperators } from "./matchers/i-operators";
import { Operators } from "./matchers/operators";
import { MatcherFactory } from "./matcher-factory";

export let containerBuilder = (): Container => {
    let container = new Container();
    //container.bind<IPropertiesMatcher<any>>(Refs.PropertiesMatcherClass).to(PropertiesMatcher);
    //container.bind<ISimpleMatcher<any>>(Refs.SimpleMatcherClass).to(EntityMatcher);
    //container.bind<IOperators<any, any>>(Refs.OperatorsClass).to(Operators);
    //container.bind<MatcherFactory>(MatcherFactory).toSelf();

    return container;
}