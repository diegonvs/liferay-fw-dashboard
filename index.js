import getRandomData from './src/misc/DataGenerator';
import client from './src/connectors/ElasticConnector';
import Info from './src/connectors/Info';
import chalk from 'chalk';
import jira from './src/connectors/JiraConnector';

export default {getRandomData, client, Info, jira};