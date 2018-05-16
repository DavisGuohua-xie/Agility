import React from 'react';


import ProjectList from './ProjectList';

export default class ProjectListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            projItems: props.projects
        }
    }

    render() {
        return <ProjectList 
                    projects={this.state.projItems}
                    onNewProject={this.handleNewProject}
                    onEnterProject={this.handleEnterProject}
                />;
    }

};